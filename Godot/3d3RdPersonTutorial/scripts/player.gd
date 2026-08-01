class_name Player
extends CharacterBody3D

@onready var anim_player: AnimationPlayer = $Mesh/AnimationPlayer
@onready var anim_tree : AnimationTree = $AnimationTree
const MAX_SPEED : float = 5.0
var SPEED : float = 5.0
const JUMP_VELOCITY = 4.5
@onready var camera: Camera3D = $CameraRig/Camera3D
@onready var mesh: Node3D = $Mesh

## running velocity
var run_speed : float = 3.5

## Default animation blend speed
const BLEND_SPEED : float = 0.2

## The current state that our player is in
var state : BasePlayerState = PlayerStates.IDLE

func _ready() -> void:
	state.enter(self)

## changes the curr player states and runs the correct functions
func change_state_to(next_state : BasePlayerState) -> void:
	state.exit(self)
	state = next_state
	state.enter(self)

func _physics_process(delta: float) -> void:
	if Input.is_action_pressed("walk"):
		SPEED = MAX_SPEED / 2
	else:
		SPEED = MAX_SPEED

	state.preUpdate(self)
	state.update(self, delta)
	

	
func turn_to(direction: Vector3) -> void:
	# + PI to rotate player 180 deg.
	var yaw := atan2(-direction.x, -direction.z) + PI
	# for smooth transition to direction
	mesh.rotation.y = lerp_angle(mesh.rotation.y, yaw, 0.2)

## reads the directional movement input for the player adjusts it based on
## the camera and returns it
func get_move_input() -> Vector3:
	# Get the input direction and handle the movement/deceleration.
	var input_dir := Input.get_vector("left", "right", "forward", "backward")
	var direction := (camera.global_basis * Vector3(input_dir.x, 0, input_dir.y))
	direction = Vector3(direction.x, 0, direction.z).normalized()
	return direction
	
## returns player current speed
func get_current_speed() -> float:
	return velocity.length()
	
## Applies velocity based on directional movement input
func update_velocity(direction: Vector3, speed: float = SPEED) -> void:
	if direction != Vector3.ZERO:
		velocity.x = direction.x * speed
		velocity.z = direction.z * speed
		turn_to(direction)
	else:
		velocity.x = move_toward(velocity.x, 0, speed)
		velocity.z = move_toward(velocity.z, 0, speed)
