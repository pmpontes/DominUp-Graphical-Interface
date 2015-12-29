/**
 * PieceAnimation
 * @constructor
 * @param time
 * @param tablePosition
 * @param scene
 * @param piece
 */
function PieceAnimation(time, tablePosition, scene, piece){
	Animation.call(this, time);
	this.arcTime = 2000;
	this.scene = scene;
	this.getPlaceCoordinates(tablePosition);
	this.angleTotal = this.getOrientation(tablePosition);
	this.angleIt = this.angleTotal / this.arcTime;
	this.arcAngle = Math.atan((this.finalZ - piece.referenceCoordinates[2])/(this.finalX - piece.referenceCoordinates[0]));
	this.arcIt = Math.PI / this.arcTime;
	this.radius = vec3.distance(vec3.fromValues(this.finalX, 0, this.finalZ), piece.referenceCoordinates) / 2;
	this.type = "PIECE";
	this.phase = "ELEVATE";
	this.activate();
	this.elevationAnimation = new LinearAnimation(0.5, [[0, 0, 0], [0, 3, 0]]);
	this.elevationAnimation.activate();

	console.log("Levels: " + scene.gameSurface.table[tablePosition.aY][tablePosition.aX].length);
	this.dropAnimation = new LinearAnimation(0.5, [[0, 0, 0], [0, scene.gameSurface.table[tablePosition.aY][tablePosition.aX].length * 0.5 - 4, 0]]);
};

PieceAnimation.prototype = Object.create(Animation.prototype);
PieceAnimation.prototype.constructor = PieceAnimation;

/**
 * update
 * Updates the animation according to currTime and its state.
 * @param currTime
 */
PieceAnimation.prototype.update = function(currTime){
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
PieceAnimation.prototype.getCurrentTransformation = function(){

	var matrx = mat4.create();
	mat4.identity(matrx);

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
		mat4.translate(matrx, matrx, vec3.fromValues(0, 0, this.radius));
		mat4.rotateX(matrx, matrx, this.arcIt*(arcTimeElapsed-500));
		mat4.translate(matrx, matrx, vec3.fromValues(0, 0, - this.radius));
		mat4.rotateX(matrx, matrx, -Math.PI*(arcTimeElapsed-500)/this.arcTime);
		mat4.rotateY(matrx, matrx, this.arcAngle);
		mat4.rotateY(matrx, matrx, this.angleIt*(arcTimeElapsed-500));
		mat4.translate(matrx, matrx, vec3.fromValues(0, -0.25, 0));

		if(this.phase == "ARC" && this.timeElapsed >= (this.arcTime + 500)){
			this.phase = "DROP";
			this.dropAnimation.activate();
		}
	}
	return matrx;
};

/**
 * getOrientation
 * Get piece orientation.
 * @param tablePosition
 */
PieceAnimation.prototype.getOrientation = function(tablePosition){
	var a = tablePosition.aX - tablePosition.bX;
	var b = tablePosition.aY - tablePosition.bY;
	if(this.scene.turn == "player1"){
		var base = -Math.PI/2;
		if(a > 0)
			base = Math.PI/2;
		else{
			if(a == 0){
				if(b > 0)
					base += Math.PI/2;
				else base -= Math.PI/2;
			}
		}
	} else {
		var base = Math.PI/2;
		if(a > 0)
			base = -Math.PI/2;
		else{
			if(a == 0){
				if(b > 0)
					base = Math.PI;
				else base -= Math.PI/2;
			}
		}
	}
	return base;
}

/**
 * getPlaceCoordinates
 * Calculates the coordinates of the final piece (centered) tablePosition considering the center of the table as the origin.
 * @param tablePosition
 */
PieceAnimation.prototype.getPlaceCoordinates = function(tablePosition){
	var Ax = tablePosition.aX;
	var Az = tablePosition.aY;
	var Bx = tablePosition.bX;
	var Bz = tablePosition.bY;
	var closerX = (Ax > Bx) ? Bx : Ax;
	var closerZ = (Az > Bz) ? Bz : Az;
	var orientation = this.getOrientation(tablePosition);

	var horizontal = true;
	if(orientation == Math.PI || orientation == 0 || orientation == 2*Math.PI || orientation == -Math.PI || orientation == -2*Math.PI)
		horizontal = false;

	console.log("horizontal? " + horizontal);

	var baseX = (horizontal) ? 1 : 0.5;
	var baseZ = (horizontal) ? 0.5 : 1;

	this.finalX = baseX + closerX;
	this.finalZ = baseZ + closerZ;
}
