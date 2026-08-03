extends StaticBody3D

var drawer1_open: bool = false
var drawer2_open: bool = false
var drawer3_open: bool = false

@onready var drawer1_node: Node3D = $Drawer1
@onready var drawer2_node: Node3D = $Drawer2
@onready var drawer3_node: Node3D = $Drawer3

func get_interact_prompt() -> String:
	return "Press E to Open/Close Drawer"


func interact() -> void:
	toggle_drawer(2)


func toggle_drawer(drawer_num: int) -> void:
	match drawer_num:
		1:
			drawer1_open = not drawer1_open
			_animate_drawer(drawer1_node, drawer1_open)
		2:
			drawer2_open = not drawer2_open
			_animate_drawer(drawer2_node, drawer2_open)
		3:
			drawer3_open = not drawer3_open
			_animate_drawer(drawer3_node, drawer3_open)


func _animate_drawer(node: Node3D, open: bool) -> void:
	if not node:
		return
	var target_z = 1 if open else 0.48
	var tween = create_tween()
	tween.tween_property(node, "position:z", target_z, 0.4).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
