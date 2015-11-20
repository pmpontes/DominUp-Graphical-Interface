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

MyInterface.prototype.initInterface = function() {
	this.mainMenu = new dat.GUI();

	this.startGameMenu = this.mainMenu.addFolder("Start new game");	
	this.newGameMenu = this.startGameMenu.addFolder("New game");	
	this.newGameMenu.add(this.scene, 'gameType', this.scene.gameTypes);
	this.startGameMenu.add(this, 'resumeSavedGame');

	// add game settings
	this.addSettings();
};


MyInterface.prototype.addSettings = function(){
	this.gameSettings = this.mainMenu.addFolder("Settings");	
	this.gameEnvironment = this.gameSettings.addFolder("Environment");	
	this.gameEnvironment.add(this.scene, 'gameEnvironment', this.scene.gameEnvironments);
	this.gameLookFolder = this.gameSettings.addFolder("Appearance");	
	this.gameLookFolder.add(this.scene, 'gameLook', this.scene.gameLooks);
}

MyInterface.prototype.resumeSavedGame = function(){
	removeGui(this.newGameMenu, this);
};

MyInterface.prototype.initGame = function(){	
	this.mainMenu.remove(this.gameSettings);

	this.gameOptionsMenu = this.mainMenu.addFolder("Options");
	this.gameOptionsMenu.add(this.scene, 'pauseGame');
	this.gameOptionsMenu.add(this.scene, 'saveGame');

	addSettings();
}

MyInterface.prototype.showGameLevels = function(Player){
	this.gameLevel = this.newGameMenu.addFolder('Level for ' + Player);	
	this.gameLevel.add(this.scene, 'gameLevel', this.scene.gameLevels);
}