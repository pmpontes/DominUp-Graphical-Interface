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

	this.suface = new Plane(scene, sizeX, sizeY);

	this.placedPieces = [];

	this.table = [];
	for(var n=0; n< this.sizeY; n++){
		this.table[n] = [];
		for(var m=0; m<this.sizeX; m++)
			this.table[n][m] = [8];
	}

	this.positions = [];
	this.positionID = [];
	var hitBoxId = 200;
	for(var n=0; n< this.sizeY; n++)
		for(var m=0; m<this.sizeX; m++){
			this.positions[[m, n]] = new Patch(scene, 1, 1, 1, [[-0.5, 0, 0.5], [-0.5, 0, -0.5], [0.5, 0, 0.5], [0.5, 0,-0.5]]);
			this.positionID[hitBoxId++] = [m,n];
		}
};

GameSurface.prototype = Object.create(CGFobject.prototype);

// position format aX,aY, bX, bY, domino [L,R]
GameSurface.prototype.placePiece = function (position, piece) {
	// calculate piece's position
	var piecePosition = { rotation:0, coords: [] };

	piecePosition.coords[0] = (position.aX + position.bX)/2.0;
	piecePosition.coords[1] = (this.table[position.aY][position.aX].length -1);
	piecePosition.coords[2] = (position.aY + position.bY)/2.0;

	// if horizontal
  if(position.aY==position.bY) {
    if(position.aX>position.bX)
      piecePosition.rotation = Math.PI;
  }else{	// if vertical
    if(position.aY<position.bY)
      piecePosition.rotation = Math.PI/2;
    else piecePosition.rotation = Math.PI/2;
  }

	// place piece on table
	this.placedPieces.push({coords: position, domino: piece });

	this.table[position.aY][position.aX].push(piece[0]);
	this.table[position.bY][position.bX].push(piece[1]);

	console.log(piece[0]);

	console.log(this.placedPieces);
	console.log(piecePosition);
	return piecePosition;
};

GameSurface.prototype.unplacePiece = function (piece) {
	for(var i=0; i<this.placedPieces.length; i++)
		if(this.placedPieces[i].domino[0] == piece[0] &&
			 this.placedPieces[i].domino[1] == piece[1] ){
			var position = this.placedPieces[i].coords;
			this.table[position.aY][position.aX].pop();
			this.table[position.bY][position.bX].pop();
			this.placedPieces.splice(i,1);
		}
		console.log(this.placedPieces);
};

GameSurface.prototype.getPosition = function (id) {
	return this.positionID[id];
};

GameSurface.prototype.getTable = function () {
		var plainTable = "[";

		for(var n=0; n< this.sizeY; n++){
			plainTable += "["
			for(var m=0; m<this.sizeX; m++){
				plainTable += "[" + this.table[n][m][this.table[n][m].length-1] + "," + (this.table[n][m].length-1) + "]";
				if(m+1 < this.sizeX)
					plainTable += ",";
			}
			plainTable += "]";
			if(n+1 < this.sizeY)
				plainTable += ",";
		}

		plainTable += "]";
		return plainTable;
};

GameSurface.prototype.constructor=GameSurface;

GameSurface.prototype.display = function () {

	this.scene.pushMatrix();

		if(!this.scene.pickMode){
			// show game surface
			this.scene.pushMatrix();
				this.scene.materials[this.scene.gameLook].setTexture(this.scene.textures[this.scene.gameLook]['gameSurface']);
				this.scene.materials[this.scene.gameLook].apply();
				this.scene.scale(this.sizeX, 1, this.sizeY);
				this.scene.translate(0.5, 0, 0.5, 1);
				this.suface.display();
		 	this.scene.popMatrix();
		}

		// draw position's hitboxes
		if(this.scene.pickMode && (this.scene.gameState=='SELECT_LOCATION_A' || this.scene.gameState=='SELECT_LOCATION_B')){
		 	var hitBoxId = 200;

			for(var n=0; n< this.sizeY; n++)
				for(var m=0; m<this.sizeX; m++){
					this.scene.pushMatrix();
						this.scene.registerForPick(hitBoxId++, this.positions[[m, n]]);
						this.scene.translate(m, (this.table[n][m].length - 1)*.5 + 0.01, n, 1);
						this.scene.translate(0.5, 0, 0.5, 1);
						this.positions[[m, n]].display();
					this.scene.popMatrix();
				}
		}

	// show pieces
	if(!this.scene.pickMode)
		for(var i=0; i<this.placedPieces.length; i++)
			this.scene.pieces[this.placedPieces[i].domino].display();

	this.scene.popMatrix();
};
