extends Node3D

var score := 0.0
var game_active := true
var best_score := 0
var global_speed := 1.0

var score_label: Label
var best_score_label: Label
var game_over_panel: CenterContainer
var restart_button: Button

const SAVE_PATH = "user://highscore.save"

func _ready():
	load_high_score()
	
	# Build HUD dynamically
	var hud = CanvasLayer.new()
	add_child(hud)
	
	score_label = Label.new()
	score_label.text = "Score: 0"
	score_label.add_theme_font_size_override("font_size", 32)
	score_label.position = Vector2(20, 20)
	hud.add_child(score_label)
	
	game_over_panel = CenterContainer.new()
	game_over_panel.set_anchors_preset(Control.PRESET_FULL_RECT) # Fills the screen
	game_over_panel.hide()
	hud.add_child(game_over_panel)
	
	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	game_over_panel.add_child(vbox)
	
	var go_label = Label.new()
	go_label.text = "GAME OVER"
	go_label.add_theme_font_size_override("font_size", 64)
	go_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(go_label)
	
	best_score_label = Label.new()
	best_score_label.text = "Best: " + str(best_score)
	best_score_label.add_theme_font_size_override("font_size", 32)
	best_score_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(best_score_label)
	
	restart_button = Button.new()
	restart_button.text = "Restart"
	restart_button.add_theme_font_size_override("font_size", 32)
	restart_button.pressed.connect(_on_restart_button_pressed)
	vbox.add_child(restart_button)

func _process(delta: float) -> void:
	if game_active:
		global_speed += delta * 0.05 # Increases speed by 5% per second
		score += delta * 10 * global_speed
		if score_label:
			score_label.text = "Score: %d" % int(score)

func game_over() -> void:
	if not game_active:
		return
	game_active = false
	
	var current_score = int(score)
	if current_score > best_score:
		best_score = current_score
		save_high_score()
	
	best_score_label.text = "Best Score: " + str(best_score)
	
	if game_over_panel:
		game_over_panel.show()

func _on_restart_button_pressed() -> void:
	get_tree().reload_current_scene()

func save_high_score():
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_32(best_score)
		file.close()

func load_high_score():
	if FileAccess.file_exists(SAVE_PATH):
		var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
		if file:
			best_score = file.get_32()
			file.close()
