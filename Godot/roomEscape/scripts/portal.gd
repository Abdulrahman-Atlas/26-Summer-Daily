extends Area3D

@export var is_active: bool = false
@export var next_scene_path: String = "res://scenes/level_2.tscn"

@onready var portal_surface: MeshInstance3D = $PortalSurface
@onready var portal_light: OmniLight3D = $OmniLight3D
@onready var label: Label3D = $Label3D

var audio_portal_active: AudioStreamPlayer3D = null
var audio_teleport: AudioStreamPlayer = null
var is_transitioning: bool = false


func _ready() -> void:
	add_to_group("portal")
	body_entered.connect(_on_body_entered)
	
	# Setup audio players
	audio_portal_active = AudioStreamPlayer3D.new()
	if ResourceLoader.exists("res://audio/active_portal.mp3"):
		audio_portal_active.stream = load("res://audio/active_portal.mp3")
		audio_portal_active.unit_size = 5.0
		audio_portal_active.max_distance = 15.0
		audio_portal_active.finished.connect(_on_portal_audio_finished)
	add_child(audio_portal_active)

	audio_teleport = AudioStreamPlayer.new()
	if ResourceLoader.exists("res://audio/teleport.mp3"):
		audio_teleport.stream = load("res://audio/teleport.mp3")
	add_child(audio_teleport)

	_update_visuals()


func _on_portal_audio_finished() -> void:
	if is_active and audio_portal_active and not is_transitioning:
		audio_portal_active.play()


func get_interact_prompt() -> String:
	if is_active:
		return "Press E to Enter Portal"
	else:
		return "Portal Inactive (Unlock Terminal First)"


func interact() -> void:
	if is_active:
		_enter_portal()


func activate_portal() -> void:
	is_active = true
	_update_visuals()


func _update_visuals() -> void:
	if portal_surface:
		portal_surface.visible = is_active
	if portal_light:
		portal_light.visible = is_active
	if label:
		if is_active:
			label.text = "PORTAL OPEN"
			label.modulate = Color(0.3, 0.9, 1.0)
		else:
			label.text = "PORTAL INACTIVE"
			label.modulate = Color(0.5, 0.5, 0.5)

	if is_active:
		if audio_portal_active and audio_portal_active.stream and not audio_portal_active.playing:
			audio_portal_active.play()
	else:
		if audio_portal_active and audio_portal_active.playing:
			audio_portal_active.stop()


func _on_body_entered(body: Node3D) -> void:
	if is_active and body.is_in_group("player"):
		_enter_portal()


func _enter_portal() -> void:
	if is_transitioning:
		return
	is_transitioning = true

	if audio_portal_active and audio_portal_active.playing:
		audio_portal_active.stop()

	if audio_teleport and audio_teleport.stream:
		audio_teleport.play()
		await get_tree().create_timer(0.45).timeout

	if ResourceLoader.exists(next_scene_path):
		get_tree().change_scene_to_file(next_scene_path)
	else:
		print("Next level scene path does not exist: ", next_scene_path)
		is_transitioning = false
