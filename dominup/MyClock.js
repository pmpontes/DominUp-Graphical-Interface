/**
 * MyClock
 * @constructor
 */

 function MyClock(scene){
 	CGFobject.call(this,scene);

	this.cylinder= new MyCylinder(scene, 12, 1);
	this.hours = new MyClockHand(scene, .4);
	this.minutes = new MyClockHand(scene, .5);
	this.seconds = new MyClockHand(scene, .6);
	this.angle=2*Math.PI/12;

	// set time 03:30:45
	this.hours.setAngle(90);
	this.minutes.setAngle(180);
	this.seconds.setAngle(270);

	this.scene.clockLookSide = new CGFappearance(scene);
	this.scene.clockLookSide.setAmbient(.6,.6,.6,1);
	this.scene.clockLookSide.setDiffuse(.80,0.80,.80,1);
	this.scene.clockLookSide.setSpecular(0.1,0.1,0.1,1);
	this.scene.clockLookSide.setShininess(10);
	
	this.scene.clockLookHand = new CGFappearance(scene);
	this.scene.clockLookHand.setAmbient(0,0,0,1);
	this.scene.clockLookHand.setDiffuse(0,0,0,1);
	this.scene.clockLookHand.setSpecular(0,0,0,1);
	this.scene.clockLookHand.setShininess(2);

	this.scene.clockLook = new CGFappearance(scene);
	this.scene.clockLook.setAmbient(.6,.6,.6,1);
	this.scene.clockLook.setDiffuse(.80,0.80,.80,1);
	this.scene.clockLook.setSpecular(.1,0.1,0.1,1);
	this.scene.clockLook.setShininess(10);	
	this.scene.clockLook.loadTexture("..\\resources\\images\\clock.png");

 	this.initBuffers();
 };

 MyClock.prototype = Object.create(CGFobject.prototype);
 MyClock.prototype.constructor = MyClock;

 MyClock.prototype.initBuffers = function() {

 	this.vertices = [];

 	this.texCoords = [];

  	var tempAngle = 0;
 	for (var i = 0; i < 12; i++) {
		this.vertices.push(Math.cos(tempAngle), Math.sin(tempAngle), 1);
		this.texCoords.push(.5+.5*Math.cos(tempAngle), 0.5-.5*Math.sin(tempAngle));
 	    tempAngle += this.angle;
     };

	this.vertices.push(0,0,1);
	this.texCoords.push(.5, 0.5);

 	this.indices = [];

	for(i = 1; i <= 12; i++)
  		if(i!=12)
  			this.indices.push(i-1,i, 12);
  		else this.indices.push(i-1,0, 12);

	this.normals = [];

	for (var i = 0; i <= 12; i++)
 	    this.normals.push(0, 0,1);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

MyClock.prototype.update = function(currTime){
	var currentDate = new Date(currTime);
	this.hours.setAngle((currentDate.getHours())*360/12);
	this.minutes.setAngle((currentDate.getMinutes())*360/60);
	this.seconds.setAngle((currentDate.getSeconds())*360/60);
}

MyClock.prototype.display = function(){
	this.scene.pushMatrix();
		this.scene.clockLookSide.apply();
		this.scene.scale(1,1,.1);
		this.cylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.clockLookHand.apply();
		this.scene.translate(0,0,.1);
		this.hours.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.clockLookHand.apply();
		this.scene.translate(0,0,.1);
		this.minutes.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.clockLookHand.apply();
		this.scene.translate(0,0,.1);
		this.seconds.display();
	this.scene.popMatrix();
	
	this.scene.clockLook.apply();
		this.scene.pushMatrix();
		this.scene.scale(1,1,.1);
		this.drawElements(this.primitiveType);
	this.scene.popMatrix();
}
