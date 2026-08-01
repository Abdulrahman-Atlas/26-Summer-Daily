class_name IdlePlayerState
extends BasePlayerState

func enter(player : Player) -> void:
	player.anim_tree.set("parameters/movement/transition_request", "idle")

func preUpdate(player: Player) -> void:
	var direction : Vector3 = player.get_move_input()
	var current_speed : float = player.get_current_speed()
	
	if not player.is_on_floor():
		player.change_state_to(PlayerStates.FALL)
	#elif current_speed > player.run_speed:
		#player.change_state_to(PlayerStates.RUN)
	elif direction.length() > 0:
		player.change_state_to(PlayerStates.WALK)
	elif Input.is_action_just_pressed("jump"):
		player.change_state_to(PlayerStates.JUMP)
