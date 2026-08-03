extends CanvasLayer

@onready var note_panel: Control = $NotePanel
@onready var note_text_label: Label = $NotePanel/CenterContainer/PaperContainer/VBoxContainer/NoteTextLabel
@onready var prompt_label: Label = $NotePanel/PromptLabel

var audio_paper: AudioStreamPlayer = null
var is_open: bool = false


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	note_panel.hide()
	
	audio_paper = AudioStreamPlayer.new()
	if ResourceLoader.exists("res://audio/paper.mp3"):
		audio_paper.stream = load("res://audio/paper.mp3")
	add_child(audio_paper)


func open_note(text: String) -> void:
	is_open = true
	if note_text_label:
		note_text_label.text = text
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
