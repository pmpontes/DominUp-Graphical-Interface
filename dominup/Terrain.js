/**
 * Terrain
 * @constructor
 * @param scene
 * @param args
 */
function Terrain(scene, texture, heightMap) {
	CGFobject.call(this,scene);

	this.texture = new CGFtexture(scene, texture);
	this.heightMap = new CGFtexture(scene, heightMap);
	this.plane = new Plane(scene, 50);
};

Terrain.prototype = Object.create(CGFobject.prototype);

Terrain.prototype.constructor=Terrain;

Terrain.prototype.display = function () {
	this.texture.bind(0);
	this.heightMap.bind(1);
	this.plane.display();
};


/*
 * updateTextelCoordinates
 * No need to update the textel's coordinates according to amplifS and amplifT.
 *
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
Terrain.prototype.updateTexelCoordinates = function (amplifS, amplifT) {};