/*
 * DominupScene
 * @constructor
 */
function DominupScene() {
    CGFscene.call(this);
}

DominupScene.prototype = Object.create(CGFscene.prototype);
DominupScene.prototype.constructor = DominupScene;

/*
 * setMyInterface
 * Sets the scene's interface.
 * @param newInterface
 */
DominupScene.prototype.setMyInterface = function(newInterface) {
	this.myInterface = newInterface;
	this.myInterface.initInterface();
}

/*
 * init
 * Initiate scene with default settings.
 * @param application
 */
DominupScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	  this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);

    // create matrix
	this.matrix = mat4.create();
    mat4.identity(this.matrix);

	this.setUpdatePeriod(30);
	this.setPickEnabled(true);

	// Game settings
	this.initGame();
};

DominupScene.prototype.initLights = function () {
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
    this[this.lights[0].id]=true;
};

DominupScene.prototype.newGame = function(){
  this.players = [];
	this.initGamePieces();
	this.initGameSurface();
	this.initGamePlayers();
}

DominupScene.prototype.updateGameState = function(){
	switch(this.state){
		case 'SELECT_GAME_TYPE':
			if(this.gameType == this.gameTypes[1]){
				this.state = 'START_GAME';
				this.players.push(new Player(this), new Player(this));
			}else if(this.gameType == this.gameTypes[1] || this.gameType == this.gameTypes[2]){
				this.state = 'SELECT_GAME_LEVEL_PL1';
				this.myInterface.showGameLevels('player1');
			}
			break;
		case 'SELECT_GAME_LEVEL_PL1':
			if(this.gameLevel != this.gameLevel[0]){
				if(this.gameType == this.gameTypes[2]){
					this.state='START_GAME';
					this.myInterface.hideGameLevels('player1');
					this.players.push(new Player(this), new Player(this, this.level));
				}
				else{
					this.players.push(new Player(this.level));
					this.state='SELECT_GAME_LEVEL_PL2';
					this.gameLevel = this.gameLevels[0];
					this.myInterface.hideGameLevels('player1');
					this.myInterface.showGameLevels('player2');
				}
			}
			break;
		case 'SELECT_GAME_LEVEL_PL2':
			if(this.gameLevel != this.gameLevel[0]){
				this.myInterface.hideGameLevels('player2');
				this.players.push(new Player(this, this.level));
				this.state='START_GAME';
			}
			break;
		case 'START_GAME':
			break;
		default: break;
	}
};

DominupScene.prototype.update = function(currTime) {
/*
  if(this.graph.loadedOk){
    if(!this.pause){
      for(id in this.animations)
        this.animations[id].update(currTime-this.timePaused);
    }else this.timePaused += (currTime - this.previousTime);
  }

  this.previousTime = currTime;*/

	if(!this.pauseGame){
	//	this.clock.update(currTime);
		this.updateGameState();
	}else this.timePaused += (currTime - this.previousTime);

	this.previousTime = currTime;
}

DominupScene.prototype.saveGame = function (){

};

/*
 * initGame
 * Initiate the game.
 */
DominupScene.prototype.initGame = function () {
	this.state = 'SELECT_GAME_TYPE';
	this.moves = [];
  this.players = [];
	//this.clock = new MyClock(this);

	this.pauseGame=false;
	this.timePaused = 0;
	this.previousTime;

  	// types of game
	this.gameTypes = ['(select type)', 'Human-Human', 'Human-Computer', 'Computer-Computer'];
	this.gameType = this.gameTypes[0];

  	// game levels
	this.gameLevels = ['(select level)', 'Random', 'Attack', 'Defense'];
	this.gameLevel = this.gameLevels[0];

	this.initGameEnvironments();
  this.initGameLooks();

	this.initGamePieces();
	this.initGameSurface();
	this.initGamePlayers();
};

/*
 * initGameEnvironment
 * Create game environment with given name.
 */
DominupScene.prototype.initGameEnvironment = function (environmentName, graph) {
  if(this.gameEnvironments.indexOf(environmentName)!=-1)
    this.environments[environmentName] = new MyEnvironment(this, graph);
  if(this.gameEnvironments.indexOf(environmentName)==0)
	this.environments[environmentName].activateEnvironment();
};

/*
 * initGameEnvironments
 * Initiate the scene's environments.
 */
DominupScene.prototype.initGameEnvironments = function () {
  // game environments options
	this.gameEnvironments = ['default', 'space', 'desert'];
	this.gameEnvironment = this.gameEnvironments[0];
	this.environments = [];
};

/*
 * initGamePieces
 * Initiate the game's pieces.
 */
DominupScene.prototype.initGamePieces = function () {
	this.pieces = [];
	var piecesId = 500;

	for(var n=0; n<8; n++)
		for(var m=0; m<=n; m++){
			this.pieces[[n,m]] = new MyPiece(this, n, m);
			this.pieces[[n,m]].setId(piecesId++);
		}
};

/*
 * initGameSurface
 * Initiate the scene's lights by default.
 */
DominupScene.prototype.initGameSurface = function () {
	this.gameSurfaceSizeX = 10;
	this.gameSurfaceSizeY = 10;
	this.gameSurface = new GameSurface(this, this.gameSurfaceSizeX, this.gameSurfaceSizeY); // TODO check this
};

/*
 * initGamePlayers
 * Initiate the scene's lights by default.
 */
DominupScene.prototype.initGamePlayers = function () {
	// send play info, initiate players in PROLOG
	// get players
  // temporarly
  this.players[0] = new Player(this);
  this.players[0].setPieces(this.pieces);
  //this.players[1].setPieces([[0,2], [0,1]]);
};

/*
 * initCameras
 * Initiate the scene's default camera.
 */
DominupScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

/*
 * setDefaultAppearance
 * Initiate the scene's default appearance.
 */
DominupScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

/*
 * updateLights
 * Update the lights.
 */
DominupScene.prototype.updateLights = function() {
	for (var i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}

/*
 * initGameLooks
 * Load the textures and create materials for the game's surface and pieces.
 */
DominupScene.prototype.initGameLooks = function () {

  // TODO add looks and textures
	// accepted game looks
	this.gameLooks = ['default', 'wood', 'marble'];
	this.gameLook = this.gameLooks[0];

	this.lookMaterials = [];
	this.lookMaterials['default'] = [];
	this.lookMaterials['default']['ambient'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['diffuse'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['specular'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['emission'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['shininess'] = 1;

	// temporarly, change later to specific values
	this.lookMaterials['wood'] = this.lookMaterials['default'];
  this.lookMaterials['marble'] = this.lookMaterials['default'];

	this.textures = [];
	this.materials = [];

	for(var i = 0; i<this.gameLooks.length; i++){
		var look = this.gameLooks[i];

		this.textures[look] = [];

		for(var n = 0; n<8; n++)
			 this.textures[look][n] = new CGFtexture(this, 'textures/' + look + '_' + n + '.png');

    this.textures[look]['gameSurface'] = new CGFtexture(this, 'textures/' + look + 'gameSurface.jpg');

		this.materials[look] = new CGFappearance(this);
		this.materials[look].setAmbient( this.lookMaterials[look]['ambient'][0],
										 this.lookMaterials[look]['ambient'][1],
										 this.lookMaterials[look]['ambient'][2],
										 this.lookMaterials[look]['ambient'][3]);

		this.materials[look].setDiffuse( this.lookMaterials[look]['diffuse'][0],
										 this.lookMaterials[look]['diffuse'][1],
										 this.lookMaterials[look]['diffuse'][2],
										 this.lookMaterials[look]['diffuse'][3]);

		this.materials[look].setSpecular(this.lookMaterials[look]['specular'][0],
										 this.lookMaterials[look]['specular'][1],
										 this.lookMaterials[look]['specular'][2],
										 this.lookMaterials[look]['specular'][3]);

		this.materials[look].setEmission(this.lookMaterials[look]['emission'][0],
										 this.lookMaterials[look]['emission'][1],
										 this.lookMaterials[look]['emission'][2],
										 this.lookMaterials[look]['emission'][3]);

		this.materials[look].setShininess(this.lookMaterials[look]['shininess']);
		this.materials[look].setTextureWrap("REPEAT","REPEAT");
	}
};


DominupScene.prototype.pieceSelected = function (id){
	if(this.selectedPiece!=undefined){
	// do anitation to old piece
	}

	this.selectedPiece=id;
	this.gameState='PIECE_SELECTED';

	console.log("pieceSelected " + id);
	// do animation to new piece
};

DominupScene.prototype.makeMove = function (){
	console.log("piece and location chosen, make move");
};

DominupScene.prototype.pickHandler = function (id){
	// if a piece was picked
	if(id>=500){
		if(this.gameState=='SELECT_PIECE' || this.selectedPiece != id)
			this.pieceSelected(id);
		else this.gameState='SELECT_LOCATION_X';
	}else{
    console.log('position selected' + this.gameSurface.getPosition(id));
    	// if a position was picked
		if(this.gameState=='SELECT_LOCATION_X')
			this.coordX = this.gameSurface.getCoord(id);
		else if(this.gameState=='SELECT_LOCATION_Y'){
			this.coordY = this.gameSurface.getCoord(id);
			this.makeMove();
		}
	}
};


DominupScene.prototype.logPicking = function (){
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];

				if (obj){
					var customId = this.pickResults[i][1];
					this.pickHandler(customId);
				}

			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

/*
 * display
 * Display the game scene.
 */
DominupScene.prototype.display = function () {
	// Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View
	this.updateProjectionMatrix();
  	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	this.setDefaultAppearance();
	this.updateLights();

	this.logPicking();
	this.clearPickRegistration();

	//this.pieces[[0,0]].setSelectable();
	//this.pieces[[0,0]].display();

  this.gameSurface.display();

  // display game environment when ready
  //if(this.gameEnvironment in this.environments)
	   //this.environments[this.gameEnvironment].display();

	if(this.state == 'Playing'){
		this.gameSurface.display();

		/*// draw pieces
		for (i =0; i<this.objects.length; i++){
			this.pushMatrix();

			this.registerForPick(i+1, this.objects[i]);

			this.objects[i].display();
			this.popMatrix();
		}*/

	}
};
