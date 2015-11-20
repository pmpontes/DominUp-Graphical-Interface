
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
	// set to identity
    mat4.identity(this.matrix);

	this.axis=new CGFaxis(this);

	this.setUpdatePeriod(30);

	// Game settings
	this.initGame();
};

DominupScene.prototype.newGame = function(){

}

DominupScene.prototype.updateGameState = function(){
	switch(this.state){
		case 'SELECT_GAME_TYPE':
			if(this.gameType == this.gameTypes[1]){
				this.state = 'START_GAME';
				this.players.push(new Player(), new Player());
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
					this.players.push(new Player(), new Player(this.level));
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
				this.players.push(new Player(this.level));	
				this.state='START_GAME';
			}
			break;
		case 'START_GAME':
			break;
		default: break;
	}
};

DominupScene.prototype.update = function(currTime) {

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
	//this.clock = new MyClock(scene);
	
	this.pauseGame=false;
	this.timePaused = 0;
	this.previousTime;

	this.gameTypes = ['(select type)', 'Human-Human', 'Human-Computer', 'Computer-Computer'];
	this.gameType = this.gameTypes[0];

	this.gameLevels = ['(select level)', 'Random', 'Attack', 'Defense'];
	this.gameLevel = this.gameLevels[0];

	this.initGameSurface();
	this.initGameEnvironments();
	this.initGamePieces();
	this.initGamePlayers();
	this.loadLooks();
};


/*
 * initGameEnvironments
 * Initiate the scene's lights by default.
 */
DominupScene.prototype.initGameEnvironments = function () {
	this.gameEnvironments = ['default', 'space', 'forest'];
	this.gameEnvironment = this.gameEnvironments[0];

	this.environments = [];
	this.environments['default'] = new MyEnvironment(this);
	this.environments['florest'] = new MyForestEnvironment(this);
	this.environments['space'] = new MySpaceEnvironment(this);
};

/*
 * initGamePieces
 * Initiate the scene's lights by default.
 */
DominupScene.prototype.initGamePieces = function () {
	this.pieces = [];

	for(var n=0; n<8; n++)
		for(var m=0; m<n; m++)
			this.pieces[[n,m]] = new MyPiece(this, n, m);
};

/*
 * initGameSurface
 * Initiate the scene's lights by default.
 */
DominupScene.prototype.initGameSurface = function () {
	this.gameSurfaceSizeX = 10;
	this.gameSurfaceSizeY = 10;
	this.gameSurface = new Plane(this, 10, this.gameSurfaceSizeX, this.gameSurfaceSizeY);
};

/*
 * initGamePlayers
 * Initiate the scene's lights by default.
 */
DominupScene.prototype.initGamePlayers = function () {
	this.players = [];

	// send game, initiate players in PROLOG

	// get players
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
 * initShaders
 * Initiate the shaders.
 */
DominupScene.prototype.initShaders = function () {
	this.terrainShader = new CGFshader(this.gl, "shaders/terrainShader.vert", "shaders/terrainShader.frag");
	this.terrainShader.setUniformsValues({normScale: 1.0});
	this.terrainShader.setUniformsValues({uSampler2: 1});
};


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/*
 * initAnimations
 * Initiate the scene's animations according to the information read.
 */
DominupScene.prototype.initAnimations = function () {
	
};

/*
 * setIllumunation
 * Create the scene's illumination accoording to the specified settings.
 */
DominupScene.prototype.setIllumination = function () {
	/*this.setGlobalAmbientLight( this.graph.illumination['ambient'][0],
								this.graph.illumination['ambient'][1],
								this.graph.illumination['ambient'][2],
								this.graph.illumination['ambient'][3]);
	this.gl.clearColor( this.graph.illumination['background'][0],
						this.graph.illumination['background'][1],
						this.graph.illumination['background'][2],
						this.graph.illumination['background'][3]);*/
};

/*
 * initLights
 * Create the scene's lights accoording to the specified settings.
 */
DominupScene.prototype.initLights = function(){

	var lightDefinitions = [];
	lightDefinitions[0]=[];
	lightDefinitions[0]['position'] = [0,0,0,0];
	lightDefinitions[0]['ambient'] = [0,0,0,0];
	lightDefinitions[0]['diffuse'] = [0,0,0,0];
	lightDefinitions[0]['specular'] = [0,0,0,0];
	
	for(var i = 0; i < lightDefinitions.length; i++){
		this.lights[i].setVisible(true);
		this.lights[i].enable();

		this.lights[i].setPosition( lightDefinitions[i]['position'][0],
									lightDefinitions[i]['position'][1],
									lightDefinitions[i]['position'][2],
									lightDefinitions[i]['position'][3]);

		this.lights[i].setAmbient(  lightDefinitions[i]['ambient'][0],
									lightDefinitions[i]['ambient'][1],
									lightDefinitions[i]['ambient'][2],
									lightDefinitions[i]['ambient'][3]);

		this.lights[i].setDiffuse(  lightDefinitions[i]['diffuse'][0],
									lightDefinitions[i]['diffuse'][1],
									lightDefinitions[i]['diffuse'][2],
									lightDefinitions[i]['diffuse'][3]);

		this.lights[i].setSpecular( lightDefinitions[i]['specular'][0],
									lightDefinitions[i]['specular'][1],
									lightDefinitions[i]['specular'][2],
									lightDefinitions[i]['specular'][3]);
	}

	this.updateLights();
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
 * loadLooks
 * Load the scene's textures and create materials.
 */
DominupScene.prototype.loadLooks = function () {
	
	// accepted game looks
	this.gameLooks = ['default', 'wood'];
	this.gameLook = this.gameType[0];
	
	this.lookMaterials = [];
	this.lookMaterials['default'] = [];
	this.lookMaterials['default']['ambient'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['diffuse'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['specular'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['emission'] = [.5,.5,.5,.5];
	this.lookMaterials['default']['shininess'] = 1;

	// temporarly, change later to specific values
	this.lookMaterials['wood'] = this.lookMaterials['default'];

	this.textures = [];
	this.materials = [];

	for(var i = 0; i<this.gameLooks.length; i++){
		var look = this.gameLooks[i];

		this.textures[look] = [];

		for(var n = 0; n<8; n++)
			this.textures[look][n] = new CGFtexture(this, 'textures/' + look + n + '.png');

		this.textures[look]['gameSurface'] = new CGFtexture(this, 'textures/' + look + 'gameSurface.png');

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

DominupScene.prototype.showTable = function() {
	this.scene.pushMatrix();
		this.scene.scale(this.scaleX, this.scaleY, 1, 0);
		this.materials[this.gameLook].setTexture(this.textures[this.gameLook]['gameSurface']);
		this.materials[this.gameLook].apply();
		this.gameSurface.display();
	this.scene.popMatrix();
};

/*
 * display
 * Display the scene.
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

    this.multMatrix(this.matrix);
	this.setDefaultAppearance();
	this.updateLights();

	this.environments[this.gameEnvironment].display();

	if(this.state == 'Playing'){
		this.showTable();
	}
};