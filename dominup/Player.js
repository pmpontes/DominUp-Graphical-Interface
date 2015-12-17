/**
 * Player
 * @constructor
 */
function Player(scene, level){
	this.scene = scene;
	this.human = (level == undefined);
	this.level = level;
};

Player.prototype = Object.create(CGFobject.prototype);

Player.prototype.constructor=Player;

Player.prototype.setPieces = function (pieces) {
	this.pieces = pieces;

	var line = 0;

	// TODO calculate initial position for each piece
	for(var i = 0; i<this.pieces.length; i++){
		if(line % 4 == 0)
			line++;

		var matrx = mat4.create();
		mat4.identity(matrx);
		mat4.translate(matrx, matrx, vec3.fromValues(6, 0, line + 6));
		mat4.rotateZ(matrx, matrx, -Math.PI);
		mat4.rotateY(matrx, matrx, -Math.PI);
		this.pieces[i].initialPosition = matrx;
	}
};

Player.prototype.getPieces = function () {
	return this.pieces;
};

Player.prototype.makeMove = function (move) {
	if(this.human)
		if(move==undefined)
			return null;

	// TODO check if valid paly
	// TODO if !human, generate play
};

Player.prototype.showDominoes = function (table, move) {
	for(var i=0; i < this.pieces; i++){
		this.scene.pushMatrix();
			this.scene.registerForPick(this.pieces[i].getId(), this.pieces[i]);
			this.pieces[i].display();
		this.scene.popMatrix();
	}
};
