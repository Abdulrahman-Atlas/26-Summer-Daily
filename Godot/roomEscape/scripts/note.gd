extends RigidBody3D

@export_multiline var note_text: String = "Secret Note Text"

@onready var preview_label: Label3D = get_node_or_null("NoteLabel")


func _ready() -> void:
	add_to_group("interactable")
	add_to_group("note")
	_update_3d_preview()


func get_interact_prompt() -> String:
	return "Press E to Read Note"


func interact() -> void:
	var note_ui = get_tree().get_first_node_in_group("note_ui")
	
	# Fallback if NoteUI is not pre-instantiated in scene
	if not note_ui:
		var note_ui_scene = load("res://scenes/note_ui.tscn")
		if note_ui_scene:
			note_ui = note_ui_scene.instantiate()
			get_tree().root.add_child(note_ui)

	if note_ui and note_ui.has_method("open_note"):
		note_ui.open_note(note_text)


func set_note_text(new_text: String) -> void:
	note_text = new_text
	_update_3d_preview()


func _update_3d_preview() -> void:
	if preview_label:
		preview_label.text = note_text
