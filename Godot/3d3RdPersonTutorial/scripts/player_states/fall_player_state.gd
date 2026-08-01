class_name FallPlayerState
extends BasePlayerState

func enter(player : Player) -> void:
	player.anim_tree.set("parameters/movement/transition_request", "fall")
	
func preUpdate(player: Player) -> void:
	if player.is_on_floor():
		player.change_state_to(PlayerStates.IDLE)
	
func update(player : Player, delta: float) -> void:
	var direction : Vector3 = player.get_move_input()
	player.velocity += player.get_gravity() * delta
	player.update_velocity(direction, player.SPEED * 0.25)
	player.move_and_slide()
	player.turn_to(direction)
