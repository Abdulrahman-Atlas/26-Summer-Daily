extends StaticBody3D

@export var has_lamp: bool = true

@onready var desk_lamp: Node3D = get_node_or_null("DeskLamp")


func _ready() -> void:
	_update_lamp_visibility()


func _update_lamp_visibility() -> void:
	if desk_lamp:
		desk_lamp.visible = has_lamp
