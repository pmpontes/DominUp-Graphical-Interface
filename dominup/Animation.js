/*
 * Animation
 * A sort of superclass for animations
 * @constructor
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

Animation.prototype.activate = function(){
	this.active = true;
};

Animation.prototype.deactivate = function(){
	this.active = false;
};

Animation.prototype.isActive = function(){
	return this.active;
};

Animation.prototype.getCurrentTransformation = function(){};

Animation.prototype.getCurrentOrientation = function(){};