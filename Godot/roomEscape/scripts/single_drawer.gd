extends StaticBody3D

@export var drawer_name: String = "Drawer"
@export var closed_z: float = 0.52
@export var open_z: float = 0.92

var is_open: bool = false
var is_animating: bool = false

var audio_open: AudioStreamPlayer = null
var audio_close: AudioStreamPlayer = null


func _ready() -> void:
	add_to_group("interactable")
	
	audio_open = AudioStreamPlayer.new()
	if ResourceLoader.exists("res://audio/drawer_open.mp3"):
		audio_open.stream = load("res://audio/drawer_open.mp3")
	add_child(audio_open)

	audio_close = AudioStreamPlayer.new()
	if ResourceLoader.exists("res://audio/drawer_close.mp3"):
		audio_close.stream = load("res://audio/drawer_close.mp3")
	add_child(audio_close)


func get_interact_prompt() -> String:
	if is_open:
		return "Press E to Close Drawer"
	else:
		return "Press E to Open Drawer"


func interact() -> void:
	if is_animating:
		return

	is_open = not is_open
	is_animating = true
	
	if is_open:
		if audio_open and audio_open.stream:
			audio_open.play()
	else:
		if audio_close and audio_close.stream:
			audio_close.play()

	var target_z = open_z if is_open else closed_z
	var tween = create_tween()
	tween.tween_property(self, "position:z", target_z, 0.40).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN_OUT)
	tween.tween_callback(func(): is_animating = false)
