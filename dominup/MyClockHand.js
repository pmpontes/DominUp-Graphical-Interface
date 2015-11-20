 /**
 * MyClockHand
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyClockHand(scene) {
	CGFobject.call(this,scene);
	this.cylinder = new MyCylinder(this.scene, 8,1);
	this.cylinder.initBuffers;
	this.angle = Math.PI/3;
};

function MyClockHand(scene, size) {
	CGFobject.call(this,scene);
	this.cylinder = new MyCylinder(this.scene, 8,1);
	this.cylinder.initBuffers;
	this.angle = Math.PI/3;
	this.size = size;
};

MyClockHand.prototype = Object.create(CGFobject.prototype);
MyClockHand.prototype.constructor=MyClockHand;

MyClockHand.prototype.display = function(){
	angle = Math.PI/2;
	this.scene.pushMatrix();
		this.scene.rotate(this.angle, 0, 0, 1);
		this.scene.rotate(-angle,1, 0, 0);
		this.scene.scale(0.05,.05,1);
		this.scene.scale(.5, .5, this.size);
		this.cylinder.display();
	this.scene.popMatrix();
}

MyClockHand.prototype.setAngle = function(ang){
	this.angle = -((ang * Math.PI)/180);
}