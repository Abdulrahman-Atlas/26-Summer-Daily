extends RigidBody3D

@export var note_title: String = "DRAWER NOTE"
@export_multiline var note_text: String = "Demonstration Note text!"

@onready var note_panel: Control = $CanvasLayer/NotePanel
@onready var title_label: Label = $CanvasLayer/NotePanel/CenterContainer/PaperBg/MarginContainer/VBoxContainer/TitleLabel
@onready var content_label: Label = $CanvasLayer/NotePanel/CenterContainer/PaperBg/MarginContainer/VBoxContainer/ContentLabel
@onready var preview_label3d: Label3D = get_node_or_null("PreviewLabel3D")

var audio_paper: AudioStreamPlayer = null
var is_open: bool = false


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	add_to_group("interactable")
	add_to_group("note")
	
	if note_panel:
		note_panel.hide()
		
	_update_labels()

	audio_paper = AudioStreamPlayer.new()
	if ResourceLoader.exists("res://audio/paper.mp3"):
		audio_paper.stream = load("res://audio/paper.mp3")
	add_child(audio_paper)


func _update_labels() -> void:
	if title_label:
		title_label.text = note_title
	if content_label:
		content_label.text = note_text
	if preview_label3d:
		preview_label3d.text = note_title


func get_interact_prompt() -> String:
	return "Press E to Read " + note_title


func interact() -> void:
	if is_open:
		close_note()
	else:
		open_note()


func open_note() -> void:
	is_open = true
	_update_labels()
	if note_panel:
		note_panel.show()
	get_tree().paused = true
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

	if audio_paper and audio_paper.stream:
		audio_paper.play()


func close_note() -> void:
	if not is_open:
		return
	is_open = false

	if audio_paper and audio_paper.stream:
		audio_paper.play()

	if note_panel:
		note_panel.hide()
	get_tree().paused = false
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _input(event: InputEvent) -> void:
	if not is_open:
		return

	if event.is_action_pressed("ui_cancel") or event.is_action_pressed("interact"):
		get_viewport().set_input_as_handled()
		close_note()
	elif event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_ESCAPE or event.keycode == KEY_E:
			get_viewport().set_input_as_handled()
			close_note()
