extends Node

# this scripts is shared globaly as: PlayerStates

# creating player state instances to access them from anywhere
# prevents creating a new instance each time a state is called
# better memory

var IDLE := IdlePlayerState.new()
var FALL := FallPlayerState.new()
var WALK := WalkPlayerState.new()
var RUN  :=  RunPlayerState.new()
var JUMP := JumpPlayerState.new()
