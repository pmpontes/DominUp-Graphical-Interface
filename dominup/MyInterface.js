/*
 * MyInterface
 * @constructor
 */
function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);

MyInterface.prototype.constructor = MyInterface;

/*
 * init
 * @param CGFapplication application
 * @return true upon success
 */
MyInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	return true;
};

MyInterface.prototype.createMainMenu = function() {
	this.mainMenu = new dat.GUI();

	// new game menu
	this.startGameMenu = this.mainMenu.addFolder("New game");
	this.startGameMenu.add(this, 'newGame');
	this.startGameMenu.add(this.scene, 'resumeSavedGame');

	// add game settings
	this.gameSettings = this.mainMenu.addFolder("Settings");
	this.gameSettings.add(this.scene, 'timeout', 0, 180).step(5);
	this.gameEnvironment = this.gameSettings.addFolder("Environment");
	this.gameEnvironment.add(this.scene, 'gameEnvironment', this.scene.gameEnvironments);
	this.gameLookFolder = this.gameSettings.addFolder("Appearance");
	this.gameLookFolder.add(this.scene, 'gameLook', this.scene.gameLooks);
};

MyInterface.prototype.newGame = function() {
	if(this.gameMenu!=undefined){
		this.scene.state='SELECT_GAME_TYPE';
		this.gameMenu.destroy();
	}

	this.scene.gameType = this.scene.gameTypes[0];

	this.newGameMenu = new dat.GUI();
	this.newGameFolder = this.newGameMenu.addFolder("Start new game");
	this.newGameFolder.add(this.scene, 'gameType', this.scene.gameTypes);

	this.newGameFolder.open();
	this.startGameMenu.close();
};

MyInterface.prototype.createGameMenu = function() {
	this.gameMenu = new dat.GUI();

	// play menu
	this.gameOptions = this.gameMenu.addFolder("Game menu");
	this.gameOptions.add(this.scene, 'pauseGame');
	this.gameOptions.add(this.scene, 'undoLastMove');
	this.gameOptions.add(this.scene, 'cameraPosition', this.scene.cameraPositions);
	this.gameOptions.add(this.scene, 'reviewGame');
	this.gameOptions.add(this.scene, 'saveGame');
};

MyInterface.prototype.destroyGameMenu = function() {
	this.gameMenu.destroy();
};

MyInterface.prototype.destroyNewGameMenu = function() {
	this.newGameMenu.destroy();
};

MyInterface.prototype.showGameLevels = function(Player){
	this.scene.gameLevel = this.scene.gameLevels[0];
	this.gameLevel = this.newGameMenu.addFolder('Level for ' + Player);
	this.gameLevel.add(this.scene, 'gameLevel', this.scene.gameLevels);
	this.gameLevel.open();
};
