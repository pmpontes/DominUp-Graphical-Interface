/*
 * ReversePieceAnimation
 * @constructor
 */
function ReversePieceAnimation(time, tablePosition, scene, piece, player, initialPosition){
	Animation.call(this, time);
	this.playerId = player;
	this.type = "REVERSE_PIECE";
	this.arcTime = 2000;
	this.scene = scene;
	this.initialPosition = initialPosition;

	//TODO
	this.getPlaceCoordinates(tablePosition);

	this.angleTotal = this.getOrientation(tablePosition);
	this.angleIt = this.angleTotal / this.arcTime;

	this.arcAngle = Math.atan((this.finalZ-piece.referenceCoordinates[2])/(this.finalX-piece.referenceCoordinates[0]));
	console.log(this.arcAngle);
//????
	this.arcIt = Math.PI / this.arcTime;

	this.radius = vec3.distance(vec3.fromValues(this.finalX, 0, this.finalZ), piece.referenceCoordinates) / 2;

	this.phase = "ELEVATE";

	this.activate();

	this.elevationAnimation = new LinearAnimation(0.5, [[0, 0, 0], [0, 4-(scene.gameSurface.table[tablePosition.aY][tablePosition.aX].length+1) * 0.5, 0]]);
	this.elevationAnimation.activate();

	console.log('Ytrans'+(4-(scene.gameSurface.table[tablePosition.aY][tablePosition.aX].length+1) * 0.5));

	this.dropAnimation = new LinearAnimation(0.5, [[0, 0, 0], [0, -3, 0]]);
};

ReversePieceAnimation.prototype = Object.create(Animation.prototype);
ReversePieceAnimation.prototype.constructor = ReversePieceAnimation;

ReversePieceAnimation.prototype.update = function(currTime){
	Animation.prototype.update.call(this, currTime);
	this.elevationAnimation.update(currTime);

	if(this.phase != "ARC" && this.phase != "ELEVATE")
		this.dropAnimation.update(currTime);
};

/*
 * getCurrentTransformation
 * calculates and returns the animation's current transformation matrix
 * @return the transformation matrix
 */
ReversePieceAnimation.prototype.getCurrentTransformation = function(){

	var matrx = mat4.create();
	mat4.identity(matrx);

	mat4.multiply(matrx, matrx, this.initialPosition);
	mat4.multiply(matrx, matrx, this.elevationAnimation.getCurrentTransformation());

	if(this.phase == "DROP"){
		mat4.multiply(matrx, matrx, this.dropAnimation.getCurrentTransformation());
		console.log('drop');
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
			console.log('drop started');
			this.dropAnimation.activate();
		}
	}
	return matrx;
};

/*
 * getOrientation
 * get Piece orientation
 */
ReversePieceAnimation.prototype.getOrientation = function(tablePosition){
	var a = tablePosition.aX - tablePosition.bX;
	var b = tablePosition.aY - tablePosition.bY;

	if(this.playerId=='player1'){
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
	console.log('orientation ' + base);
	return base;
}

/*
 * getPlaceCoordinates
 * calculates the coordinates of the final piece (centered) tablePosition considering the center of the table as the origin
 */
ReversePieceAnimation.prototype.getPlaceCoordinates = function(tablePosition){
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

	console.log('finalX: ' + this.finalX);
	console.log('finalZ: ' + this.finalZ);
}
