extends StaticBody3D

@export var is_locked: bool = true
var is_open: bool = false
var is_animating: bool = false

@onready var door_pivot: Node3D = $DoorPivot


func get_interact_prompt() -> String:
	if is_locked:
		return "Press E to enter Code on Keypad"
	elif is_open:
		return "Press E to Close Door"
	else:
		return "Press E to Open Door"


func interact() -> void:
	if is_locked:
		var keypad = get_tree().get_first_node_in_group("keypad_ui")
		if keypad and keypad.has_method("open_keypad"):
			keypad.open_keypad(self)
	else:
		toggle_door()


func unlock_door() -> void:
	is_locked = false
	if not is_open:
		toggle_door()


func toggle_door() -> void:
	if is_animating or not door_pivot:
		return
	
	is_open = not is_open
	var target_angle = deg_to_rad(-90.0) if is_open else 0.0
	
	is_animating = true
	var tween = create_tween()
	tween.tween_property(door_pivot, "rotation:y", target_angle, 1.0).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN_OUT)
	tween.tween_callback(func(): is_animating = false)
