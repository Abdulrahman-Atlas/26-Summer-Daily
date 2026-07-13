extends CharacterBody3D


@export var SPEED: float = 8.0
@export var JUMP_VELOCITY: float = 4.5
@export var gravity: float = 9.81
@export var sensitivity: float = 0.002

@onready var head: Node3D = $head
@onready var camera: Camera3D = $head/Camera3D
@onready var player: CharacterBody3D = $"."

@onready var gunRaycast: RayCast3D = $head/Camera3D/gun/RayCast3D
@onready var gunAnimations: AnimationPlayer = $head/Camera3D/gun/gunAnimations


@onready var reloadAudio: AudioStreamPlayer = $head/Camera3D/gun/AudioStreamPlayer


var bullet = preload("res://assets/Player/bullet.tscn")
var magSize: int = 30
var bulletsLeft : int = magSize

@onready var healthBar: ProgressBar = $head/Camera3D/healthBar
@onready var damageArea: Area3D = $DamageArea
var health: float = 3


func _ready() -> void:
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	
	
func _unhandled_input(event: InputEvent) -> void:
	healthBar.set_value_no_signal(health)
	if event is InputEventMouseMotion:
		head.rotate_y(-event.relative.x * sensitivity)
		camera.rotate_x(-event.relative.y * sensitivity)
		camera.rotation.x = clamp(camera.rotation.x, deg_to_rad(-40), deg_to_rad(60))	
	pass		
			

func _physics_process(delta: float) -> void:
	# handle death
	if health == 0:
		get_tree().reload_current_scene()
	
	# bullet count text
	$head/Camera3D/Label.text = str(bulletsLeft) + " / " + str(magSize)
	
	# Add the gravity.
	if not is_on_floor():
		velocity += get_gravity() * delta

	# Handle jump.
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = JUMP_VELOCITY

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	var input_dir := Input.get_vector("left", "right", "up", "down")
	var direction := (head.transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	if direction:
		velocity.x = direction.x * SPEED
		velocity.z = direction.z * SPEED
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		velocity.z = move_toward(velocity.z, 0, SPEED)
		
	if Input.is_action_pressed("shoot") and bulletsLeft > 0:
		if !gunAnimations.is_playing():
			gunAnimations.play("shooting")
			shoot()
			
	if Input.is_action_just_pressed("reload") and bulletsLeft < magSize:
		if !gunAnimations.is_playing():
			gunAnimations.play("reload")
			reloadAudio.play(1.15)
			bulletsLeft = magSize			

	move_and_slide()
	
func damage():
	health -= 1
	
	
	
func shoot():
	bulletsLeft -= 1
	var bullet_instance = bullet.instantiate()
	bullet_instance.position = gunRaycast.global_position
	bullet_instance.transform.basis = gunRaycast.global_transform.basis
	get_parent().add_child(bullet_instance)
