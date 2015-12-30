/**
 * Plane
 * @constructor
 * @param scene
 * @param parts
 * @param position
 * @param planeBase
 */
function Plane(scene, parts, position, planeBase) {
	CGFobject.call(this, scene);

	this.parts = (parts==undefined) ? 1 : parts;

	this.position = position || [0,0,0];
	this.planeBase = planeBase;

	this.plane = new Patch(scene, 1, this.parts, this.parts, [[-0.5, 0, 0.5], [-0.5, 0, -0.5], [0.5, 0, 0.5], [0.5, 0,-0.5]]);
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor=Plane;

/**
 * display
 * Displays the plane on the scene.
 */
Plane.prototype.display = function () {
	this.scene.pushMatrix();
		this.scene.translate(this.position[0],this.position[1],this.position[2]);
		if(this.planeBase=='xy')
			this.scene.rotate(Math.PI/2, 1,0,0);
		this.plane.display();
	this.scene.popMatrix();
};


/*
 * updateTextelCoordinates
 * No need to update the textel's coordinates according to amplifS and amplifT.
 *
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
Plane.prototype.updateTexelCoordinates = function (amplifS, amplifT) {};
