extends Node3D

const OBSTACLE = preload("uid://cnougx5vf2n0d")
@export var spacing := 15.0
@export var visible_count := 8
@onready var player: CharacterBody3D = $"../player"

var next_z := 0
#var counter := 0

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	for i in visible_count:
		spawn_obstacle()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	
	for obstacle in get_children():
		if obstacle.position.z > player.position.z + 20:
			print("obstacle deleted")
			var new_z = obstacle.position.z - (spacing * visible_count)
			obstacle.queue_free()
			spawn_obstacle_at(new_z)
	
func spawn_obstacle():
	var obstacle = OBSTACLE.instantiate()
	obstacle.position.z = next_z
	add_child(obstacle)
	next_z -= spacing

func spawn_obstacle_at(z_pos: float):
	var obstacle = OBSTACLE.instantiate()
	obstacle.position.z = z_pos
	print('obstacle created at ' + str(z_pos))
	add_child(obstacle)
