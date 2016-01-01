/**
 * CircularAnimation
 * @constructor
 * @param time
 * @param center
 * @param radius
 * @param angStart
 * @param angRot
 */
function CircularAnimation(time, center, radius, angStart, angRot, axis, noOrientation){
	Animation.call(this, time);
	this.center = center;
	this.axis = axis || 'yy';
	this.radius = radius;
	this.startAngle = angStart;
	this.rotAngle = angRot;
	if(this.rotAngle > 0)
		this.orientation = 1;
	else
		this.orientation = 0;

		if(noOrientation)
			this.orientation = 0;
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * reset
 * Resets this animation's parameters, so it is restarted.
 */
CircularAnimation.prototype.reset = function(){
	this.animationMatrix = mat4.create();
	this.startTime = 0;
	this.timeElapsed = 0;
	this.state = "START";
	this.active = false;
	this.endTime = 0;
	this.overtime = false;
};

/**
 * getCurrentTransformation
 * Calculates and returns the animation's current transformation matrix.
 * @return the transformation matrix
 */
CircularAnimation.prototype.getCurrentTransformation = function(){
	// In case the animation has ended, consistently return the transformation matrix last position of the animation
	if(this.overtime == false)
		var currAngle = ((this.timeElapsed * this.rotAngle) / this.animationTime) + this.startAngle;
	else
		var currAngle = this.rotAngle + this.startAngle;

	var matrx = mat4.create();
	mat4.identity(matrx);

	// Places the center of the rotation where it was specified in the constructor
	var vectr = vec3.fromValues(this.center[0], this.center[1], this.center[2]);
	mat4.translate(matrx, matrx, vectr);

	// Rotates the object the calculated amount, taking the animation time into account
	switch (this.axis) {
		case 'xx':
			mat4.rotateX(matrx, matrx, currAngle);
			break;
		case 'yy':
			mat4.rotateY(matrx, matrx, currAngle);
			break;
		case 'zz':
			mat4.rotateZ(matrx, matrx, currAngle);
			break;
		default:
			break;
	}

	// Translates the element to the point in the x axis with "radius" distance to the origin
	vectr = vec3.fromValues(this.radius, 0, 0);
	mat4.translate(matrx, matrx, vectr);

	// Rotates the object for it to face the rotation direction
	if(this.orientation == 1){
		switch (this.axis) {
			case 'xx':
				mat4.rotateX(matrx, matrx, Math.PI);
				break;
			case 'yy':
				mat4.rotateY(matrx, matrx, Math.PI);
				break;
			case 'zz':
				mat4.rotateZ(matrx, matrx, Math.PI);
				break;
			default:
				break;
		}
	}
	return matrx;
};


/**
 * getCurrentOrientation
 * Calculates and returns the animation's current orientation transformation matrix.
 * @return the orientation transformation matrix
 */
CircularAnimation.prototype.getCurrentOrientation = function(){
	var ident = mat4.create();
	mat4.identity(ident);
	return ident;
};
