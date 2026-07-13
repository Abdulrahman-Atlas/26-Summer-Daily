extends CharacterBody3D

@export var speed : float = 4
@export var gravity : float = 9.81
@onready var navigation_agent_3d: NavigationAgent3D = $NavigationAgent3D
@onready var player: CharacterBody3D = $"../player"

func _ready() -> void:
	#executes once at the start of compilation.
	$holder/AnimationPlayer.play("mixamo_com")
	pass
	

func _physics_process(delta: float) -> void:
	# first gravity impact on velY
	velocity.y -= gravity * delta
	
	var dir = to_local(navigation_agent_3d.get_next_path_position()).normalized()
	velocity.x = dir.x * speed
	velocity.z = dir.z * speed
	
	$holder.look_at(player.position)
	$holder.rotation.x = 0
	move_and_slide()
	pass
	
func makepath():
	navigation_agent_3d.target_position = player.global_position
	

func _on_timer_timeout() -> void:
	makepath()
	pass 
	


func _on_area_3d_body_entered(body: Node3D) -> void:
	if body.is_in_group("player"):
		body.damage()
