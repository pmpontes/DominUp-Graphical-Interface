/**
 * ReversePieceAnimation
 * @constructor
 * @param time
 * @param tablePosition
 * @param scene
 * @param piece
 */
function ReversePieceAnimation(time, scene, piece, player){
	Animation.call(this, time);
	this.arcTime = 2000;
	this.scene = scene;
	this.piece = piece;
	this.player = player;
	this.angleTotal = piece.orientationAngle;
	this.angleIt = this.angleTotal / this.arcTime;
	this.arcAngle = Math.atan((piece.piecePlacement[2] - piece.referenceCoordinates[2])/(piece.piecePlacement[0] - piece.referenceCoordinates[0]));
	this.arcIt = Math.PI / this.arcTime;
	this.radius = vec3.distance(piece.piecePlacement, piece.referenceCoordinates) / 2;
	this.type = "PIECE";
	this.phase = "ELEVATE";
	this.activate();
	this.elevationAnimation = new LinearAnimation(0.5, [[0, (piece.level - 1) * 0.5, 0], [0, 3, 0]]);
	this.elevationAnimation.activate();

	console.log(this.player);

	this.dropAnimation = new LinearAnimation(0.5, [[0, 0, 0], [0, -3, 0]]);
};

ReversePieceAnimation.prototype = Object.create(Animation.prototype);
ReversePieceAnimation.prototype.constructor = ReversePieceAnimation;

/**
 * update
 * Updates the animation according to currTime and its state.
 * @param currTime
 */
ReversePieceAnimation.prototype.update = function(currTime){
	Animation.prototype.update.call(this, currTime);
	this.elevationAnimation.update(currTime);
	if(this.phase != "ARC" && this.phase != "ELEVATE")
		this.dropAnimation.update(currTime);
};

/**
 * getCurrentTransformation
 * calculates and returns the animation's current transformation matrix
 * @return the transformation matrix
 */
ReversePieceAnimation.prototype.getCurrentTransformation = function(){

	var matrx = mat4.create();
	mat4.identity(matrx);

	if(this.player == "player2")
		mat4.translate(matrx, matrx, vec3.fromValues(-(this.piece.piecePlacement[2] - this.piece.referenceCoordinates[2]), 0, -(this.piece.referenceCoordinates[0] - this.piece.piecePlacement[0])));
	else{
		mat4.translate(matrx, matrx, vec3.fromValues(this.piece.piecePlacement[2] - this.piece.referenceCoordinates[2], 0, this.piece.referenceCoordinates[0] - this.piece.piecePlacement[0]));
	}

	mat4.multiply(matrx, matrx, this.elevationAnimation.getCurrentTransformation());
	if(this.phase == "DROP"){
		mat4.multiply(matrx, matrx, this.dropAnimation.getCurrentTransformation());
	}

	if(this.timeElapsed >= 500){
		if(this.phase == "ELEVATE")
			this.phase = "ARC";
		var arcTimeElapsed = (this.timeElapsed >= (this.arcTime + 500)) ? (this.arcTime + 500) : this.timeElapsed;

		mat4.translate(matrx, matrx, vec3.fromValues(0, 0.25, 0));
		mat4.rotateY(matrx, matrx, -this.arcAngle);
		mat4.translate(matrx, matrx, vec3.fromValues(0, 0, - this.radius));
		mat4.rotateX(matrx, matrx, - this.arcIt*(arcTimeElapsed-500));
		mat4.translate(matrx, matrx, vec3.fromValues(0, 0, this.radius));
		mat4.rotateX(matrx, matrx, Math.PI*(arcTimeElapsed-500)/this.arcTime);
		mat4.rotateY(matrx, matrx, this.arcAngle);
		mat4.rotateY(matrx, matrx, (this.angleIt)*(this.arcTime + 500 - arcTimeElapsed));
		mat4.translate(matrx, matrx, vec3.fromValues(0, -0.25, 0));

		if(this.phase == "ARC" && this.timeElapsed >= (this.arcTime + 500)){
			this.phase = "DROP";
			this.dropAnimation.activate();
		}
	} else  if (this.timeElapsed <= 2500) mat4.rotateY(matrx, matrx, this.angleTotal);
	return matrx;
};
