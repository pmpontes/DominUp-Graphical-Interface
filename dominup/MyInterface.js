var interface = null;
/*
 * MyInterface
 * @constructor
 */
function MyInterface() {
	CGFinterface.call(this);
	interface = this;
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

	// add game settings
	this.staticCamera = true;
	this.gameSettings = this.mainMenu.addFolder("Settings");
	this.gameSettings.add(this.scene, 'timeout', 0, 180).step(5);
	var toggleCamera = this.gameSettings.add(this, 'staticCamera');
	this.gameEnvironment = this.gameSettings.addFolder("Environment");
	var toggleEnviromnent = this.gameEnvironment.add(this.scene, 'gameEnvironment', this.scene.gameEnvironments);
	this.gameLookFolder = this.gameSettings.addFolder("Appearance");
	this.gameLookFolder.add(this.scene, 'gameLook', this.scene.gameLooks);

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

MyInterface.prototype.newGame = function() {
	if(this.gameMenu!=undefined){
		this.scene.state='SELECT_GAME_TYPE';
		this.destroyGameMenu();
	}

	if(this.newGameMenu!=undefined){
		this.scene.state='SELECT_GAME_TYPE';
		this.newGameMenu.destroy();
	}

	this.scene.gameType = this.scene.gameTypes[0];
	this.scene.gameLevel = this.scene.gameLevels[0];

	this.newGameMenu = new dat.GUI();
	this.newGameFolder = this.newGameMenu.addFolder("Start new game");
	this.newGameFolder.add(this.scene, 'gameType', this.scene.gameTypes);

	this.newGameFolder.open();
	this.startGameMenu.close();
};

MyInterface.prototype.createGameMenu = function() {
	if(this.gameMenu!=undefined)
		this.destroyGameMenu();

	this.gameMenu = new dat.GUI();

	// play menu
	this.gameOptions = this.gameMenu.addFolder("Game menu");
	this.gameOptions.add(this.scene, 'pauseGame');
	this.gameOptions.add(this.scene, 'undoLastMove');
	this.cameraFolder = this.gameOptions.addFolder("Camera");
	this.cameraFolder.add(this.scene, 'cameraPosition', this.scene.cameraPositions);
	this.cameraFolder.add(this, 'make360turn');
	this.gameOptions.add(this.scene, 'reviewGame');
};

MyInterface.prototype.make360turn = function() {
	this.scene.updateCameraPosition('360 view');
};

MyInterface.prototype.createReviewMenu = function() {
	this.reviewMenu = new dat.GUI();
	// play menu
	this.reviewOptions = this.reviewMenu.addFolder("Review menu");
	this.reviewOptions.add(this.scene, 'pauseReview');
	//this.reviewOptions.add(this.scene, 'reviewSpeed', 0.5, 4).step(.5);
	this.reviewOptions.add(this.scene, 'quitReview');
	this.reviewOptions.open();
};

MyInterface.prototype.destroyGameMenu = function() {
	if(this.gameMenu!=undefined){
		this.gameMenu.destroy();
		this.gameMenu=undefined;
	}
};

MyInterface.prototype.destroyReviewMenu = function() {
	if(this.reviewMenu!=undefined){
		this.reviewMenu.destroy();
		this.reviewMenu=undefined;
	}
};

MyInterface.prototype.destroyNewGameMenu = function() {
	if(this.newGameMenu!=undefined){
		this.newGameMenu.destroy();
		this.newGameMenu=undefined;
	}
};

MyInterface.prototype.showGameLevels = function(Player){
	this.scene.gameLevel = this.scene.gameLevels[0];
	this.gameLevel = this.newGameMenu.addFolder('Level for ' + Player);
	this.gameLevel.add(this.scene, 'gameLevel', this.scene.gameLevels);
	this.gameLevel.open();
};
