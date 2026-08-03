class_name WalkPlayerState
extends BasePlayerState

func enter(player : Player) -> void:
	player.anim_tree.set("parameters/movement/transition_request", "walk")
	
func preUpdate(player: Player) -> void:
	var curren_speed : float = player.get_current_speed()
	if not player.is_on_floor():
		player.change_state_to(PlayerStates.FALL)
	elif Input.is_action_just_pressed("jump"):
		player.change_state_to(PlayerStates.JUMP)
	elif curren_speed == 0:
		player.change_state_to(PlayerStates.IDLE)
	elif curren_speed > player.run_speed:
		player.change_state_to(PlayerStates.RUN)

func update(player : Player, _delta: float) -> void:
	var direction : Vector3 = player.get_move_input()
	player.update_velocity(direction)
	player.move_and_slide()
	player.turn_to(direction)
	player.anim_tree.set("parameters/movement/transition_request", "walk")
