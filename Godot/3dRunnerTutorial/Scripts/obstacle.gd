extends Node3D

@export var SPEED := 5.0

# road and gap width
@export var roadWidth := 10.0
@export var gap := 2.0

@onready var left_mesh: MeshInstance3D = $leftWall/leftMesh
@onready var left_coll: CollisionShape3D = $leftWall/leftColl
@onready var right_mesh: MeshInstance3D = $rightWall/rightMesh
@onready var right_coll: CollisionShape3D = $rightWall/rightColl

func _ready() -> void:
	# Randomize the gap center every time this obstacle is spawned
	var gapCenter = randf_range(-roadWidth / 2.0 + gap / 2.0, roadWidth / 2.0 - gap / 2.0)
	
	# left and right coordinates of gap
	var gapLeft : float = gapCenter - gap / 2.0
	var gapRight : float = gapCenter + gap / 2.0
	
	var leftWidth = gapLeft - (-roadWidth / 2.0)
	var rightWidth = roadWidth / 2.0 - gapRight
	
	if leftWidth < 0.3:
		leftWidth = 0.3
	
	if rightWidth < 0.3:
		rightWidth = 0.3
	# Make mesh and collision resources unique so modifying them doesn't affect all instances
	left_mesh.mesh = left_mesh.mesh.duplicate()
	right_mesh.mesh = right_mesh.mesh.duplicate()
	left_coll.shape = left_coll.shape.duplicate()
	right_coll.shape = right_coll.shape.duplicate()
	
	var neon_mat = StandardMaterial3D.new()
	neon_mat.albedo_color = Color(1, 0, 0.5) # Neon pink
	neon_mat.emission_enabled = true
	neon_mat.emission = Color(1, 0, 0.5)
	neon_mat.emission_energy_multiplier = 1.5
	
	left_mesh.mesh.material = neon_mat
	right_mesh.mesh.material = neon_mat
	
	# Set width for meshes and collision shapes
	left_mesh.mesh.size.x = leftWidth
	right_mesh.mesh.size.x = rightWidth
	left_coll.shape.size.x = leftWidth
	right_coll.shape.size.x = rightWidth
	
	# Adjust positions so the walls align perfectly with the road edges
	$leftWall.position.x = (-roadWidth / 2.0 + gapLeft) / 2.0
	$rightWall.position.x = (gapRight + roadWidth / 2.0) / 2.0


@onready var game_manager = get_tree().current_scene

var counter = 0
func _process(delta: float) -> void:
	if game_manager and game_manager.game_active:
		position.z += delta * SPEED * game_manager.global_speed
