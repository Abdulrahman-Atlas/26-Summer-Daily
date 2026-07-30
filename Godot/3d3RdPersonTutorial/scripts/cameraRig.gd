extends SpringArm3D

@onready  var camera: Camera3D = $Camera3D
@export var sens : float = 50.0
var mouseInput : Vector2 = Vector2.ZERO
@onready var player: CharacterBody3D = $".."
var cameraRigHeight : float = position.y

func _ready() -> void:
	# overwriting spring length to match camera z position
	camera = get_node("Camera3D")
	spring_length = camera.position.z
	# Mouse mode (lock mouse pointer)
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	mouseInput = mouseInput * sens * delta
	rotation_degrees.y -= mouseInput.x
	rotation_degrees.x -= mouseInput.y
	rotation_degrees.x = clampf(rotation_degrees.x, -70, 50)
	mouseInput = Vector2.ZERO

func _input(event: InputEvent) -> void:
	if event is InputEventMouseMotion:
		mouseInput = event.relative
	elif event is InputEventKey and event.keycode == KEY_ESCAPE and event.pressed:
		if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		else:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
			
