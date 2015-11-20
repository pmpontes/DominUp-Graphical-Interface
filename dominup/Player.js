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