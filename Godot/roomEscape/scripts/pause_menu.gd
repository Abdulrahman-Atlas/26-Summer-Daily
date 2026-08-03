extends CanvasLayer

@onready var pause_panel: Control = $PausePanel
@onready var sens_slider: HSlider = $PausePanel/VBoxContainer/SensContainer/SensSlider
@onready var sens_val_label: Label = $PausePanel/VBoxContainer/SensContainer/HBoxLabel/SensValueLabel
@onready var resume_button: Button = $PausePanel/VBoxContainer/ResumeButton
@onready var restart_button: Button = $PausePanel/VBoxContainer/RestartButton

var player: CharacterBody3D = null


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	pause_panel.hide()
	
	resume_button.pressed.connect(_on_resume_pressed)
	restart_button.pressed.connect(_on_restart_pressed)
	sens_slider.value_changed.connect(_on_sens_changed)
	
	_find_player()


func _find_player() -> void:
	await get_tree().process_frame
	player = get_tree().get_first_node_in_group("player")
	if not player:
		player = get_node_or_null("../player")
	
	if player and "MOUSE_SENSITIVITY" in player:
		sens_slider.value = player.MOUSE_SENSITIVITY * 1000.0
		_update_sens_label(sens_slider.value)


func _input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel") or (event is InputEventKey and event.pressed and not event.echo and (event.keycode == KEY_ESCAPE or event.physical_keycode == KEY_ESCAPE)):
		# If keypad UI modal is open, don't interrupt keypad
		var keypad = get_tree().get_first_node_in_group("keypad_ui")
		if keypad and keypad.has_node("KeypadPanel") and keypad.get_node("KeypadPanel").visible:
			return

		toggle_pause()
		get_viewport().set_input_as_handled()


func toggle_pause() -> void:
	if not player:
		_find_player()

	var is_paused = not get_tree().paused
	get_tree().paused = is_paused
	
	if is_paused:
		pause_panel.show()
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	else:
		pause_panel.hide()
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _on_resume_pressed() -> void:
	toggle_pause()


func _on_restart_pressed() -> void:
	get_tree().paused = false
	get_tree().reload_current_scene()


func _on_sens_changed(value: float) -> void:
	_update_sens_label(value)
	var new_sens = value / 1000.0
	if player and "MOUSE_SENSITIVITY" in player:
		player.MOUSE_SENSITIVITY = new_sens


func _update_sens_label(val: float) -> void:
	sens_val_label.text = "%.1f" % val
