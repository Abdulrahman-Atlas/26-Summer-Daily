extends StaticBody3D

@export var secret_code: String = "7429"
@export var is_unlocked: bool = false
@export var portal_node: NodePath

@onready var status_light: MeshInstance3D = $StatusLight
@onready var screen_label: Label3D = $ScreenLabel

func get_interact_prompt() -> String:
	if is_unlocked:
		return "Terminal Access: UNLOCKED"
	else:
		return "Press E to Access Keypad Terminal"


func interact() -> void:
	if not is_unlocked:
		var keypad = get_tree().get_first_node_in_group("keypad_ui")
		if keypad and keypad.has_method("open_keypad"):
			keypad.open_keypad(self, secret_code)


func unlock_door() -> void:
	is_unlocked = true
	if screen_label:
		screen_label.text = "UNLOCKED"
		screen_label.modulate = Color.GREEN
		
	if status_light and status_light.material_override:
		status_light.material_override.albedo_color = Color.GREEN
		status_light.material_override.emission = Color.GREEN

	# Activate portal if path is assigned or found in scene
	var portal = get_node_or_null(portal_node)
	if not portal:
		portal = get_tree().get_first_node_in_group("portal")
	
	if portal and portal.has_method("activate_portal"):
		portal.activate_portal()
