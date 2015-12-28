/**
 * Animation
 * A superclass for animations
 * @constructor
 * @param time
 */
function Animation(time){
	this.animationTime = time*1000;
	this.animationMatrix = mat4.create();
	this.startTime = 0;
	this.timeElapsed = 0;
	this.state = "START";
	this.active = false;
	this.endTime = 0;
	this.overtime = false;
};

/**
 * update
 * Updates the animation according to currTime and its state.
 * @param currTime
 */
Animation.prototype.update = function(currTime){
	if(this.active == true){
		switch(this.state){
			case "START":
				this.startTime = currTime;
				this.endTime = currTime + this.animationTime;
				this.state = "CONTINUE";
				break;
			case "CONTINUE":
				if(this.endTime >= currTime)
					this.timeElapsed = currTime - this.startTime;
				else{
					if(this.overtime == false)
						this.overtime = true;
					else{
						this.state = "END";
						this.deactivate();
					}
				}
				break;
			default:
				break;
		}
	}
};

/**
 * activate
 * Sets the animation as active.
 */
Animation.prototype.activate = function(){
	this.active = true;
};

/**
 * deactivate
 * Sets the animation as inactive.
 */
Animation.prototype.deactivate = function(){
	this.active = false;
};

/**
 * isActive
 * Tells if the animation is active.
 * @return true if the animation is activate.
 */
Animation.prototype.isActive = function(){
	return this.active;
};

Animation.prototype.getCurrentTransformation = function(){};
Animation.prototype.getCurrentOrientation = function(){};
