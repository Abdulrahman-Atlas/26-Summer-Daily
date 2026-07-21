extends CharacterBody3D

@export var SPEED: float = 10.0
var dead := false

func _physics_process(delta: float) -> void:
	if dead:
		return
		
	# Add the gravity.
	if not is_on_floor():
		velocity += get_gravity() * delta

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	var input_dir := Input.get_vector("left", "right", "none", "none")
	var direction := (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	# any zero vector us considered false => NO input from user
	if direction:
		velocity.x = direction.x * SPEED
		#velocity.z = direction.z * SPEED
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		#velocity.z = move_toward(velocity.z, 0, SPEED)

	move_and_slide()
	
	# Check collisions
	for i in get_slide_collision_count():
		var collision = get_slide_collision(i)
		if collision.get_collider().is_in_group("obstacle"):
			die()

func die():
	dead = true
	# Notify the Game Manager (World node)
	var world = get_parent()
	if world.has_method("game_over"):
		world.game_over()
