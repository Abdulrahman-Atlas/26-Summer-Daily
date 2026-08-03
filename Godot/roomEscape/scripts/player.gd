extends CharacterBody3D

const SPEED = 5.0
const CROUCH_SPEED = 2.5
const JUMP_VELOCITY = 4.5

const STANDING_HEIGHT = 2.0
const CROUCH_HEIGHT = 1.1
const STANDING_CAM_Y = 1.6
const CROUCH_CAM_Y = 0.85

@export var MOUSE_SENSITIVITY: float = 0.003

@onready var camera: Camera3D = get_node_or_null("Camera3D")
@onready var collision_shape: CollisionShape3D = get_node_or_null("CollisionShape3D")
@onready var mesh_instance: MeshInstance3D = get_node_or_null("MeshInstance3D")

var audio_footsteps: AudioStreamPlayer = null
var is_crouching: bool = false


func _ready() -> void:
	add_to_group("player")
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	
	audio_footsteps = AudioStreamPlayer.new()
	if ResourceLoader.exists("res://audio/wood_footsteps.mp3"):
		audio_footsteps.stream = load("res://audio/wood_footsteps.mp3")
		audio_footsteps.volume_db = -6.0
	add_child(audio_footsteps)


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		rotate_y(-event.relative.x * MOUSE_SENSITIVITY)
		if camera:
			camera.rotate_x(-event.relative.y * MOUSE_SENSITIVITY)
			camera.rotation.x = clamp(camera.rotation.x, deg_to_rad(-89.0), deg_to_rad(89.0))


func _physics_process(delta: float) -> void:
	# Handle ducking / crouching input (Ctrl key or crouch/walk action)
	is_crouching = Input.is_key_pressed(KEY_CTRL) or Input.is_action_pressed("crouch") or Input.is_action_pressed("walk")
	_update_crouch_height(delta)

	# Add gravity
	if not is_on_floor():
		velocity += get_gravity() * delta

	# Handle jump (can only jump when standing)
	if Input.is_action_just_pressed("jump") and is_on_floor() and not is_crouching:
		velocity.y = JUMP_VELOCITY

	# Get input direction using custom actions
	var input_dir := Input.get_vector("left", "right", "forward", "backward")
	var direction := (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	
	var current_speed = CROUCH_SPEED if is_crouching else SPEED
	if direction:
		velocity.x = direction.x * current_speed
		velocity.z = direction.z * current_speed
	else:
		velocity.x = move_toward(velocity.x, 0, current_speed)
		velocity.z = move_toward(velocity.z, 0, current_speed)

	move_and_slide()
	_handle_footsteps()


func _update_crouch_height(delta: float) -> void:
	var target_cam_y = CROUCH_CAM_Y if is_crouching else STANDING_CAM_Y
	var target_height = CROUCH_HEIGHT if is_crouching else STANDING_HEIGHT

	# Smooth camera POV transition
	if camera:
		camera.position.y = lerp(camera.position.y, target_cam_y, delta * 12.0)

	# Update collision shape height and position
	if collision_shape and collision_shape.shape is CapsuleShape3D:
		var cap_shape: CapsuleShape3D = collision_shape.shape
		cap_shape.height = lerp(cap_shape.height, target_height, delta * 12.0)
		collision_shape.position.y = cap_shape.height / 2.0

	# Update mesh height and position to match POV
	if mesh_instance and mesh_instance.mesh is CapsuleMesh:
		var cap_mesh: CapsuleMesh = mesh_instance.mesh
		cap_mesh.height = lerp(cap_mesh.height, target_height, delta * 12.0)
		mesh_instance.position.y = cap_mesh.height / 2.0


func _handle_footsteps() -> void:
	if not audio_footsteps or not audio_footsteps.stream:
		return
		
	var horizontal_speed = Vector2(velocity.x, velocity.z).length()
	if is_on_floor() and horizontal_speed > 0.5:
		if not audio_footsteps.playing:
			audio_footsteps.play()
	else:
		if audio_footsteps.playing:
			audio_footsteps.stop()
