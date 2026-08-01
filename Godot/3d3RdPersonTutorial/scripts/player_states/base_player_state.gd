class_name BasePlayerState
extends RefCounted

## called when we first enter this state
func enter(player : Player) -> void:
	pass
	

## called when we exit a state
func exit(player : Player) -> void:
	pass
	
	
	
## called before update is called, allows for state changes
func preUpdate(player: Player) -> void:
	pass

## called every physics frame
func update(player : Player, delta: float) -> void:
	pass
