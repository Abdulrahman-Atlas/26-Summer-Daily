extends CanvasLayer

signal door_unlocked

var active_secret_code: String = "7429"

@onready var keypad_panel: Control = $KeypadPanel
@onready var display_label: Label = $KeypadPanel/VBoxContainer/DisplayPanel/DisplayLabel
@onready var close_button: Button = $KeypadPanel/VBoxContainer/Header/CloseButton

var audio_push: AudioStreamPlayer = null
var audio_approved: AudioStreamPlayer = null
var audio_denied: AudioStreamPlayer = null

var current_input: String = ""
var target_door: Node = null


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	keypad_panel.hide()
	close_button.pressed.connect(close_keypad)
	
	# Setup audio streams
	audio_push = _create_audio_player("res://audio/button_push.mp3")
	audio_approved = _create_audio_player("res://audio/approved.mp3")
	audio_denied = _create_audio_player("res://audio/denied.mp3")
	
	# Connect keypad number buttons 0-9
	for i in range(10):
		var btn = get_node_or_null("KeypadPanel/VBoxContainer/GridContainer/Btn" + str(i))
		if btn:
			btn.pressed.connect(_on_number_pressed.bind(str(i)))
			
	var clear_btn = get_node_or_null("KeypadPanel/VBoxContainer/GridContainer/BtnClear")
	if clear_btn:
		clear_btn.pressed.connect(_on_clear_pressed)
		
	var enter_btn = get_node_or_null("KeypadPanel/VBoxContainer/GridContainer/BtnEnter")
	if enter_btn:
		enter_btn.pressed.connect(_on_enter_pressed)


func _create_audio_player(stream_path: String) -> AudioStreamPlayer:
	var player = AudioStreamPlayer.new()
	if ResourceLoader.exists(stream_path):
		player.stream = load(stream_path)
	add_child(player)
	return player


func open_keypad(door_node: Node = null, code_override: String = "") -> void:
	target_door = door_node
	active_secret_code = code_override if code_override.length() > 0 else "7429"
	current_input = ""
	_update_display()
	keypad_panel.show()
	get_tree().paused = true
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	if audio_push and audio_push.stream:
		audio_push.play()


func close_keypad() -> void:
	keypad_panel.hide()
	get_tree().paused = false
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _unhandled_input(event: InputEvent) -> void:
	if not keypad_panel.visible:
		return

	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_ESCAPE:
			close_keypad()
			get_viewport().set_input_as_handled()
		elif event.keycode >= KEY_0 and event.keycode <= KEY_9:
			var num = str(event.keycode - KEY_0)
			_on_number_pressed(num)
			get_viewport().set_input_as_handled()
		elif event.keycode >= KEY_KP_0 and event.keycode <= KEY_KP_9:
			var num = str(event.keycode - KEY_KP_0)
			_on_number_pressed(num)
			get_viewport().set_input_as_handled()
		elif event.keycode == KEY_BACKSPACE or event.keycode == KEY_DELETE:
			_on_clear_pressed()
			get_viewport().set_input_as_handled()
		elif event.keycode == KEY_ENTER or event.keycode == KEY_KP_ENTER:
			_on_enter_pressed()
			get_viewport().set_input_as_handled()


func _on_number_pressed(num_str: String) -> void:
	if audio_push and audio_push.stream:
		audio_push.play()
	if current_input.length() < 4:
		current_input += num_str
		_update_display()


func _on_clear_pressed() -> void:
	if audio_push and audio_push.stream:
		audio_push.play()
	current_input = ""
	_update_display()


func _on_enter_pressed() -> void:
	if current_input == active_secret_code:
		if audio_approved and audio_approved.stream:
			audio_approved.play()
		display_label.text = "GRANTED"
		display_label.modulate = Color.GREEN
		emit_signal("door_unlocked")
		if target_door and target_door.has_method("unlock_door"):
			target_door.unlock_door()
		await get_tree().create_timer(0.6).timeout
		close_keypad()
	else:
		if audio_denied and audio_denied.stream:
			audio_denied.play()
		display_label.text = "DENIED"
		display_label.modulate = Color.RED
		await get_tree().create_timer(0.8).timeout
		current_input = ""
		display_label.modulate = Color.WHITE
		_update_display()


func _update_display() -> void:
	display_label.modulate = Color.WHITE
	if current_input.length() == 0:
		display_label.text = "_ _ _ _"
	else:
		var display_str = ""
		for i in range(current_input.length()):
			display_str += current_input[i] + " "
		for i in range(4 - current_input.length()):
			display_str += "_ "
		display_label.text = display_str.strip_edges()
