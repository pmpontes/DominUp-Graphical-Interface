/**
 * Player
 * @constructor
 */
function Player(level){
	this.human = (level == undefined);
	this.level = level;
};

Player.prototype = Object.create(CGFobject.prototype);

Player.prototype.constructor=Player;

Player.prototype.setPieces = function (pieces) {
	this.pieces = pieces.slice();
};

Player.prototype.getPieces = function () {
	return this.pieces;
};

Player.prototype.makeMove = function (table, move) {
	if(this.human)
		if(move==undefined)
			return null;
};
