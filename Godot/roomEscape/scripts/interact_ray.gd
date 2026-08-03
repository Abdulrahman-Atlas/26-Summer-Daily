extends RayCast3D
class_name InteractRay

@export var interact_distance: float = 3.0
@export var prompt_label_path: NodePath = NodePath("../../HUD/InteractLabel")

@onready var prompt_label: Label = get_node_or_null(prompt_label_path)

var current_target: Node = null


func _ready() -> void:
	target_position = Vector3(0, 0, -interact_distance)
	enabled = true
	collide_with_bodies = true
	collide_with_areas = true
	
	# Exclude player parent body from ray collision
	var player_node = get_parent()
	while player_node and not player_node is CharacterBody3D:
		player_node = player_node.get_parent()
	if player_node:
		add_exception(player_node)
		
	if prompt_label:
		prompt_label.text = ""
		prompt_label.visible = false


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("interact") or (event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_E):
		if current_target and current_target.has_method("interact"):
			current_target.interact()
			get_viewport().set_input_as_handled()


func _physics_process(_delta: float) -> void:
	_update_interaction()


func _update_interaction() -> void:
	current_target = null
	var prompt_text = ""

	if is_colliding():
		var collider = get_collider()
		if collider:
			var target = collider
			if not target.has_method("interact") and target.get_parent() and target.get_parent().has_method("interact"):
				target = target.get_parent()
				
			if target.has_method("interact") or target.is_in_group("interactable"):
				current_target = target
				if target.has_method("get_interact_prompt"):
					prompt_text = target.get_interact_prompt()

	if prompt_label:
		if current_target != null and prompt_text.length() > 0:
			prompt_label.text = prompt_text
			prompt_label.visible = true
		else:
			prompt_label.text = ""
			prompt_label.visible = false
