/**
 * GameSurface
 * @constructor
 * @param scene
 * @param parts
 */
function GameSurface(scene, sizeX, sizeY) {
	CGFobject.call(this, scene);

	this.sizeX = sizeX;
	this.sizeY = sizeY;

	this.positions = [];

	for(var n=0; n< this.sizeY; n++)
		for(var m=0; m<this.sizeX; m++)
			this.positions[[m, n]] = new Patch(scene, 1, 1, 1, [[-0.5, 0, 0.5], [-0.5, 0, -0.5], [0.5, 0, 0.5], [0.5, 0,-0.5]]);
};

GameSurface.prototype = Object.create(CGFobject.prototype);

GameSurface.prototype.constructor=GameSurface;

GameSurface.prototype.display = function () {
	
	for(var n=0; n< this.sizeY; n++)
		for(var m=0; m<this.sizeX; m++){
			this.scene.pushMatrix();
				this.scene.translate(m, 0, n, 1);

				this.scene.registerForPick([m, n], this.positions[[m, n]]);

				this.positions[[m, n]].display();
			this.scene.popMatrix();
		}

};


/*
 * updateTextelCoordinates
 * No need to update the textel's coordinates according to amplifS and amplifT.
 *
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
GameSurface.prototype.updateTexelCoordinates = function (amplifS, amplifT) {};