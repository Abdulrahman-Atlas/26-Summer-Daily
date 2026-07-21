extends CSGMesh3D

@export var base_speed := 5.0
@onready var game_manager = $".."

func _process(delta: float) -> void:
	if game_manager and game_manager.game_active:
		$".".material.uv1_offset -= Vector3(0, 0, 1) * delta * base_speed * game_manager.global_speed
