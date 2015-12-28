/*
 * LinearAnimation
 * @constructor
 */
function LinearAnimation(time, points){
	Animation.call(this, time);

	this.startingPoint = points[0];
	this.type = "LINEAR";

	this.controlPoints = points.slice(0);
	this.currentSegment = 0;
	this.timeForEach = [];				// time allotted for each segment
	this.endAnimationTime = [];			// instant in each segment finishes
	this.distanceForEach = [];			// length of each segment
	this.totalDistance = 0;				// sum of all the segments length's
	this.incrementPerTimeUnit = [];		// A vector for each segment: units of space for each axis that the segment has for each time unit (millisecond)


	for(var i = 0; i < (points.length - 1); i++){
		this.distanceForEach[i] = Math.sqrt(Math.pow(points[i][0] - points[i+1][0], 2)
											+ Math.pow(points[i][1] - points[i+1][1], 2)
											 + Math.pow(points[i][2] - points[i+1][2], 2));
		this.totalDistance += this.distanceForEach[i];
	}

	for(var i = 0; i < (points.length - 1); i++){
		this.timeForEach[i] = (this.distanceForEach[i] * this.animationTime) / this.totalDistance;
		if(i == 0){
			this.endAnimationTime[i] = this.timeForEach[i];
		}
		else{
			this.endAnimationTime[i] = this.endAnimationTime[i-1] + this.timeForEach[i];
		}
	}

	for(var i = 0; i < (points.length - 1); i++){
		this.incrementPerTimeUnit[i] = [(points[i+1][0] - points[i][0])/this.timeForEach[i],
										(points[i+1][1] - points[i][1])/this.timeForEach[i],
										(points[i+1][2] - points[i][2])/this.timeForEach[i]];
	}
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

/*
 * reset
 * resets the variables on which the animation cycle depends
 */
LinearAnimation.prototype.reset = function(){
	this.animationMatrix = mat4.create();
	this.startTime = 0;
	this.timeElapsed = 0;
	this.state = "START";
	this.active = false;
	this.endTime = 0;
	this.currentSegment = 0;
	this.overtime = false;
	this.previousOrientation = null;
};

/*
 * getCurrentTransformation
 * calculates and returns the animation's current transformation matrix
 * @return the transformation matrix
 */
LinearAnimation.prototype.getCurrentTransformation = function(){
	var matrx = mat4.create();
	mat4.identity(matrx);
	if(this.overtime==false){
		// Calculates the current translation matrix by determining the part of each animation segment to be applied
		for(var i = this.controlPoints.length -2; i >= 0; i--){
			var timeApplied = this.timeElapsed - (this.endAnimationTime[i] - this.timeForEach[i]);
			if(timeApplied > 0){
				if(timeApplied > this.timeForEach[i])
					timeApplied = this.timeForEach[i];
				else
					this.currentSegment = i;

				// Create vector with translation values for animation segment
				var vectr = vec3.fromValues(this.incrementPerTimeUnit[i][0]*timeApplied,
											this.incrementPerTimeUnit[i][1]*timeApplied,
											this.incrementPerTimeUnit[i][2]*timeApplied);

				mat4.translate(matrx, matrx, vectr);			// Apply the previously calculated vector to the transformation matrix
			}
		}

		var initialPoint = vec4.fromValues(this.startingPoint[0], this.startingPoint[1], this.startingPoint[2]);
		mat4.translate(matrx, matrx, initialPoint);
	} else {
		// In case the animation time is over, constantly return the transformation matrix to the last point of the animation
		var finalPoint = vec4.fromValues(this.controlPoints[this.controlPoints.length-1][0],
											this.controlPoints[this.controlPoints.length-1][1],
											this.controlPoints[this.controlPoints.length-1][2]);
		mat4.translate(matrx, matrx, finalPoint);
	}

	this.animationMatrix = matrx;

	return matrx;
};

/*
 * getCurrentOrientation
 * calculates and returns the animation's current orientation transformation matrix
 * @return the orientation transformation matrix
 */
LinearAnimation.prototype.getCurrentOrientation = function(){
	var rotationAngle = 0;
	var orientationMat = mat4.create();
	mat4.identity(orientationMat);
	var zCoord = this.incrementPerTimeUnit[this.currentSegment][2];
	var xCoord = this.incrementPerTimeUnit[this.currentSegment][0];

	if(zCoord == 0){
		if(xCoord != 0)
			rotationAngle = Math.PI/2;
		else
			if(this.previousOrientation != null)
				rotationAngle = this.previousOrientation;
	} else {
		rotationAngle = Math.atan(xCoord/zCoord);
	}

	if((zCoord < 0) || (zCoord == 0 && xCoord < 0))
		rotationAngle += Math.PI;

	mat4.rotateY(orientationMat, orientationMat, rotationAngle);
	if(this.previousOrientation == null)
		this.previousOrientation = rotationAngle;
	return orientationMat;
};
