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

	this.table = [];

	for(var n=0; n< this.sizeY; n++){
		var line = [];
		for(var m=0; m<this.sizeX; m++)
			line.push([8,0]);
		this.table.push(line);
	}

	this.positions = [];

	for(var n=0; n< this.sizeY; n++)
		for(var m=0; m<this.sizeX; m++)
			this.positions[[m, n]] = new Patch(scene, 1, 1, 1, [[-0.5, 0, 0.5], [-0.5, 0, -0.5], [0.5, 0, 0.5], [0.5, 0,-0.5]]);
};

GameSurface.prototype = Object.create(CGFobject.prototype);

GameSurface.prototype.placePiece = function (position, piece) {
		this.table[position.aY][position.aX].push(piece[0]);
		this.table[position.bY][position.bX].push(piece[1]);
};

GameSurface.prototype.unplacePiece = function (position) {
		this.table[position.aY][position.aX].pop();
		this.table[position.bY][position.bX].pop();
};

GameSurface.prototype.getTable = function () {
		var plainTable = [];

		for(var n=0; n< this.sizeY; n++)
			for(var m=0; m<this.sizeX; m++){
				plainTable[n][m] = this.table[n][m].pop();
				this.table[n][m].push(plainTable[n][m]);
			}

		return plainTable;
};

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
