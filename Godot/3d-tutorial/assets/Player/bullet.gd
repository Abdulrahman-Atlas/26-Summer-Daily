extends Area3D

var SPEED: float = 100

func _process(delta: float) -> void:
	position += transform.basis * Vector3(0, 0, -SPEED) * delta


func _on_body_entered(body: Node3D) -> void:
	if body.is_in_group("enemy"):
		body.queue_free()
	queue_free()	
	pass 


func _on_timer_timeout() -> void:
	queue_free()
