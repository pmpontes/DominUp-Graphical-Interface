/**
 * Player
 * @constructor
 */
function Player(scene, id, level){
	this.scene = scene;
	this.human = (level == undefined);
	this.level = level;
	this.playerId = id;
};

Player.prototype = Object.create(CGFobject.prototype);

Player.prototype.constructor=Player;

Player.prototype.setPieces = function (pieces) {
	this.pieces = pieces.slice();

	var line = 0;
	var column = 0;

	// calculate initial position for each piece
	for(var i = 0; i<this.pieces.length; i++){
		if(i % 4 == 0){
			line+=2;
			column = 0;
		}

		var matrx = mat4.create();
		mat4.identity(matrx);
		mat4.translate(matrx, matrx, vec3.fromValues(10 + line, 0.5, 9 -column));
		mat4.rotateY(matrx, matrx, -Math.PI/2);

		if(this.playerId=='playerId')
			mat4.rotateY(matrx, matrx, Math.PI);

		this.scene.pieces[this.pieces[i]].initialPosition = matrx;

		column+=2 + 2/3.0;
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

Player.prototype.showDominoes = function (){
	for(var i=0; i<this.pieces.length; i++){
		this.scene.pushMatrix();
			this.scene.registerForPick(this.scene.pieces[this.pieces[i]].getId(), this.pieces[i]);
			this.scene.pieces[this.pieces[i]].display();
		this.scene.popMatrix();
	}
};
