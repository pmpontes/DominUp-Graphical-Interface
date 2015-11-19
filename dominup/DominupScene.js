
/*
 * GameScene
 * @constructor
 */
function GameScene() {
    CGFscene.call(this);
}

GameScene.prototype = Object.create(CGFscene.prototype);

GameScene.prototype.constructor = GameScene;

/*
 * setMyInterface
 * Sets the scene's interface.
 * @param newInterface
 */
GameScene.prototype.setMyInterface = function(newInterface) {
	this.myInterface = newInterface;
}

/*
 * init
 * Initiate scene with default settings.
 * @param application
 */
GameScene.prototype.init = function (application) {
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

	this.pause=false;
	this.timePaused = 0;
	this.previousTime;
};

GameScene.prototype.update = function(currTime) {

	if(!this.pause){
		// update game state
	}else this.timePaused += (currTime - this.previousTime);

	this.previousTime = currTime;
}

/*
 * initLights
 * Initiate the scene's lights by default.
 */
GameScene.prototype.initLights = function () {
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
    this[this.lights[0].id]=true;
};

/*
 * initCameras
 * Initiate the scene's default camera.
 */
GameScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

/*
 * setDefaultAppearance
 * Initiate the scene's default appearance.
 */
GameScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

/*
 * initShaders
 * Initiate the shaders.
 */
GameScene.prototype.initShaders = function () {
	this.terrainShader = new CGFshader(this.gl, "shaders/terrainShader.vert", "shaders/terrainShader.frag");
	this.terrainShader.setUniformsValues({normScale: 1.0});
	this.terrainShader.setUniformsValues({uSampler2: 1});
};


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/*
 * initGeometry
 * Initiate the scene's geometry according to the information read.
 */
GameScene.prototype.initGeometry = function () {
	
};

/*
 * initAnimations
 * Initiate the scene's animations according to the information read.
 */
GameScene.prototype.initAnimations = function () {
	
};

/*
 * setInitials
 * Set the scene's definitions to the specified values.
 */
GameScene.prototype.setInitials = function () {

};

/*
 * setIllumunation
 * Create the scene's illumination accoording to the specified settings.
 */
GameScene.prototype.setIllumination = function () {
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
 * createLights
 * Create the scene's lights accoording to the specified settings.
 */
GameScene.prototype.createLights = function(){
	var numberOfLights = this.graph.lights.length;

	for(var i = 0; i < numberOfLights; i++){
		this.lights[i].name = this.graph.lights[i]['id'];

		// debug
		this.lights[i].setVisible(true);

		this[this.lights[i].name] = this.graph.lights[i]['enable'];

		if(this.graph.lights[i]['enable'])
			this.lights[i].enable();
		else this.lights[i].disable();

		this.lights[i].setPosition( this.graph.lights[i]['position'][0],
									this.graph.lights[i]['position'][1],
									this.graph.lights[i]['position'][2],
									this.graph.lights[i]['position'][3]);

		this.lights[i].setAmbient(  this.graph.lights[i]['ambient'][0],
									this.graph.lights[i]['ambient'][1],
									this.graph.lights[i]['ambient'][2],
									this.graph.lights[i]['ambient'][3]);

		this.lights[i].setDiffuse(  this.graph.lights[i]['diffuse'][0],
									this.graph.lights[i]['diffuse'][1],
									this.graph.lights[i]['diffuse'][2],
									this.graph.lights[i]['diffuse'][3]);

		this.lights[i].setSpecular( this.graph.lights[i]['specular'][0],
									this.graph.lights[i]['specular'][1],
									this.graph.lights[i]['specular'][2],
									this.graph.lights[i]['specular'][3]);
	}

	this.myInterface.listLights();	// create the light switchers
};

/*
 * updateLights
 * Update the lights according to their current state (enabled/disabled).
 */
GameScene.prototype.updateLights = function() {
	var i;
	for (i = 0; i < this.lights.length; i++){
		if(this[this.lights[i].name])
				this.lights[i].enable();
		else this.lights[i].disable();
		this.lights[i].update();
	}
}

/*
 * loadTextures
 * Load the scene's textures.
 */
GameScene.prototype.loadTextures = function () {

	this.textures = [];
	this.amplificationFactor = [];

/*	for(id in this.graph.textures){
		this.textures[id] = new CGFtexture(this, this.graph.textures[id]['file']);
		this.amplificationFactor[id] = this.graph.textures[id]['amplif_factor'];
	}*/
};

/*
 * loadMaterials
 * Create the scene's materials.
 */
GameScene.prototype.loadMaterials = function () {

	this.materials = [];

	// default material
	this.materials['default'] = new  CGFappearance(this);
	this.materials['default'].setAmbient(.5,.5,.5,.5);
	this.materials['default'].setDiffuse(.5,.5,.5,.5);
	this.materials['default'].setSpecular(.5,.5,.5,.5);
	this.materials['default'].setEmission(.5,.5,.5,.5);
	this.materials['default'].setShininess(1);
	this.materials['default'].setTextureWrap("REPEAT","REPEAT");

};

/*
 * display
 * Display the scene.
 */
GameScene.prototype.display = function () {
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
};