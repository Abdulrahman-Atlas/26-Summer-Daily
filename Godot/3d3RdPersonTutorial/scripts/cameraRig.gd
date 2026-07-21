extends SpringArm3D

var camera: Camera3D


func _ready() -> void:
	# overwriting spring length to match camera z position
	camera = get_node("Camera3D")
	spring_length = camera.position.z

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass
