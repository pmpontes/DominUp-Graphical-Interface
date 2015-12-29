var interface = null;

/**
 * MyInterface
 * @constructor
 */
function MyInterface() {
	CGFinterface.call(this);
	interface = this;
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param CGFapplication application
 * @return true upon success
 */
MyInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	return true;
};

/**
 * createMainMenu
 * Create a new main menu.
 */
MyInterface.prototype.createMainMenu = function() {
	this.mainMenu = new dat.GUI();

	// new game menu
	this.startGameMenu = this.mainMenu.addFolder("New game");
	this.startGameMenu.add(this, 'newGame');

	// add game settings
	this.gameSettings = this.mainMenu.addFolder("Settings");
	this.gameSettings.add(this.scene, 'timeout', 0, 180).step(5);
	var toggleCamera = this.gameSettings.add(this.scene.cameraManager, 'staticCamera');
	this.gameEnvironment = this.gameSettings.addFolder("Environment");
	var toggleEnviromnent = this.gameEnvironment.add(this.scene, 'gameEnvironment', this.scene.gameEnvironments);
	this.gameLookFolder = this.gameSettings.addFolder("Appearance");
	this.gameLookFolder.add(this.scene, 'gameLook', this.scene.gameLooks);
	this.gameLookFolder.add(this.scene, 'pieceGeometry');

	toggleCamera.onFinishChange(function(staticCamera) {
		if(staticCamera)
			interface.setActiveCamera(interface.scene.camera);
		else interface.setActiveCamera(null);
	});

	toggleEnviromnent.onFinishChange(function() {
		if(interface.scene && interface.scene.environments[interface.scene.gameEnvironment]!=undefined)
			interface.scene.environments[interface.scene.gameEnvironment].activateEnvironment();
	});
};

/**
 * newGame
 * Create a new game menu, destroying all other menus but the main menu.
 */
MyInterface.prototype.newGame = function() {
	this.destroyGameMenu();
	this.destroyNewGameMenu();
	this.destroyReviewMenu();

	this.scene.gameType = this.scene.gameTypes[0];
	this.scene.gameLevel = this.scene.gameLevels[0];
	this.scene.state='SELECT_GAME_TYPE';

	this.newGameMenu = new dat.GUI();
	this.newGameFolder = this.newGameMenu.addFolder("Start new game");
	this.newGameFolder.add(this.scene, 'gameType', this.scene.gameTypes);

	this.newGameFolder.open();
	this.startGameMenu.close();
};

/**
 * showGameLevels
 * Creates input field with game levels options.
 */
MyInterface.prototype.showGameLevels = function(Player){
	this.scene.gameLevel = this.scene.gameLevels[0];
	this.gameLevel = this.newGameMenu.addFolder('Level for ' + Player);
	this.gameLevel.add(this.scene, 'gameLevel', this.scene.gameLevels);
	this.gameLevel.open();
};

/**
 * createGameMenu
 * Create a game menu, destroying other game menus.
 */
MyInterface.prototype.createGameMenu = function() {
	this.destroyGameMenu();
	this.destroyNewGameMenu();

	this.gameMenu = new dat.GUI();

	// play menu
	this.gameOptions = this.gameMenu.addFolder("Game menu");
	this.gameOptions.add(this.scene, 'pauseGame');
	this.gameOptions.add(this.scene, 'hintMove');
	this.gameOptions.add(this.scene, 'undoLastMove');
	this.cameraFolder = this.gameOptions.addFolder("Camera");
	toggleCameraPosition = this.cameraFolder.add(this.scene.cameraManager,
		'cameraPosition', this.scene.cameraManager.cameraPositions);
	this.cameraFolder.add(this, 'make360turn');
	this.gameOptions.add(this.scene, 'reviewGame');

	toggleCameraPosition.onFinishChange(function(newPosition) {
		interface.scene.cameraManager.changePosition(newPosition);
	});
};

/**
 * make360turn
 * Sets the scene's camera to make a 360º turn.
 */
MyInterface.prototype.make360turn = function() {
	this.scene.cameraManager.changePosition('360 view');
};

/**
 * createReviewMenu
 * Create a review menu, destroying other game menus.
 */
MyInterface.prototype.createReviewMenu = function() {
	this.destroyGameMenu();
	this.destroyNewGameMenu();

	this.reviewMenu = new dat.GUI();

	// play menu
	this.reviewOptions = this.reviewMenu.addFolder("Review menu");
	this.reviewOptions.add(this.scene, 'pauseReview');
	this.reviewOptions.add(this.scene, 'quitReview');
	this.reviewOptions.open();
};

/**
 * destroyGameMenu
 * Eliminates game menu.
 */
MyInterface.prototype.destroyGameMenu = function() {
	if(this.gameMenu!=undefined){
		this.gameMenu.destroy();
		this.gameMenu=undefined;
	}
};

/**
 * destroyReviewMenu
 * Eliminates review menu.
 */
MyInterface.prototype.destroyReviewMenu = function() {
	if(this.reviewMenu!=undefined){
		this.reviewMenu.destroy();
		this.reviewMenu=undefined;
	}
};

/**
 * destroyNewGameMenu
 * Eliminates new game menu.
 */
MyInterface.prototype.destroyNewGameMenu = function() {
	if(this.newGameMenu!=undefined){
		this.newGameMenu.destroy();
		this.newGameMenu=undefined;
	}
};
