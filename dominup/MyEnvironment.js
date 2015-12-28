/**
 * MyEnvironment
 * @constructor
 * @param scene
 */
function MyEnvironment(scene, gameGraph) {
 	this.scene = scene;
  this.graph = gameGraph;
  this.loop = true;

  // create matrix
  this.matrix = mat4.create();
  // set to identity
  mat4.identity(this.matrix);

  // load environment elements
  this.loadTextures();
  this.loadMaterials();
  this.initAnimations();
  this.initShaders();
  this.initGeometry();
};

MyEnvironment.prototype.update = function(currTime) {
	for(id in this.animations)
 		this.animations[id].update(currTime);
};

/**
 * activateEnvironment
 * Set the scene to the settings specified on file.
 */
MyEnvironment.prototype.activateEnvironment = function () {
   	this.setInitials();
   	this.setIllumination();
    this.createLights();

    for(id in this.animations)
      this.animations[id].reset();
};

function degToRad(degrees) {
   return degrees * Math.PI / 180;
}

/**
 * setInitials
 * Set the scene's definitions to the specified values.
 */
MyEnvironment.prototype.setInitials = function () {
  mat4.identity(this.matrix);

	// add  translation
	mat4.translate(this.matrix, this.matrix, this.graph.initials['translation']);

	// add rotations
	var n;
	for(n=0; n<3; n++){
		switch(this.graph.initials['rotations'][n][0]){
			case 'x':
				mat4.rotateX(this.matrix, this.matrix, degToRad(this.graph.initials['rotations'][n][1]));
				break;
			case 'y':
				mat4.rotateY(this.matrix, this.matrix, degToRad(this.graph.initials['rotations'][n][1]));
				break;
			case 'z':
				mat4.rotateZ(this.matrix, this.matrix, degToRad(this.graph.initials['rotations'][n][1]));
				break;
			default: break;
		}
	}

  // add scale
	mat4.scale(this.matrix, this.matrix, this.graph.initials['scale']);
};

/**
 * setIllumunation
 * Create the scene's illumination accoording to the specified settings.
 */
MyEnvironment.prototype.setIllumination = function () {
	this.scene.setGlobalAmbientLight( this.graph.illumination['ambient'][0],
								this.graph.illumination['ambient'][1],
								this.graph.illumination['ambient'][2],
								this.graph.illumination['ambient'][3]);
	this.scene.gl.clearColor( this.graph.illumination['background'][0],
						this.graph.illumination['background'][1],
						this.graph.illumination['background'][2],
						this.graph.illumination['background'][3]);
};


/**
 * createLights
 * Create the scene's lights accoording to the specified settings.
 */
MyEnvironment.prototype.createLights = function(){

	for(var i = 0; i < this.graph.lights.length && i<5; i++){
		this.scene.lights[i].enable();

		this.scene.lights[i].setPosition( this.graph.lights[i]['position'][0],
									this.graph.lights[i]['position'][1],
									this.graph.lights[i]['position'][2],
									this.graph.lights[i]['position'][3]);

		this.scene.lights[i].setAmbient(  this.graph.lights[i]['ambient'][0],
									this.graph.lights[i]['ambient'][1],
									this.graph.lights[i]['ambient'][2],
									this.graph.lights[i]['ambient'][3]);

		this.scene.lights[i].setDiffuse(  this.graph.lights[i]['diffuse'][0],
									this.graph.lights[i]['diffuse'][1],
									this.graph.lights[i]['diffuse'][2],
									this.graph.lights[i]['diffuse'][3]);

		this.scene.lights[i].setSpecular( this.graph.lights[i]['specular'][0],
									this.graph.lights[i]['specular'][1],
									this.graph.lights[i]['specular'][2],
									this.graph.lights[i]['specular'][3]);
	}
};

/**
 * initGeometry
 * Initiate the scene's geometry according to the information read.
 */
MyEnvironment.prototype.initGeometry = function () {
 	this.leaves = [];
 	for(id in this.graph.leaves)
 		switch(this.graph.leaves[id]['type']){
 		case 'rectangle':
 			this.leaves[id] = new MyRectangle(this.scene, this.graph.leaves[id]['args']);
 			break;
 		case 'cylinder':
 			this.leaves[id] = new MyCylinder(this.scene, this.graph.leaves[id]['args']);
 			break;
 		case 'sphere':
 			this.leaves[id] = new MySphere(this.scene, this.graph.leaves[id]['args']);
 			break;
    case 'sphereReversed':
      this.leaves[id] = new MySphereReversed(this.scene, this.graph.leaves[id]['args']);
      break;
 		case 'triangle':
 			this.leaves[id] = new MyTriangle(this.scene, this.graph.leaves[id]['args']);
 			break;
 		case 'plane':
 			this.leaves[id] = new Plane(this.scene, this.graph.leaves[id]['parts']);
 			break;
 		case 'patch':
 			this.leaves[id] = new Patch(this.scene,
 										this.graph.leaves[id]['order'],
 										this.graph.leaves[id]['partsU'],
 										this.graph.leaves[id]['partsV'],
 										this.graph.leaves[id]['controlPoints']);
 			break;
 		case 'vehicle':
 			this.leaves[id] = new Vehicle(this.scene);
 			break;
 		case 'terrain':
 			this.leaves[id] = new Terrain(this.scene, this.graph.leaves[id]['texture'], this.graph.leaves[id]['heightMap']);
 			break;
 		default: break;
 		}
};

/**
 * initAnimations
 * Initiate the scene's animations according to the information read.
 */
MyEnvironment.prototype.initAnimations = function () {
 	this.animations = [];

 	// initiate the animations
 	for(id in this.graph.animations)
 		switch(this.graph.animations[id]['type']){
 		case 'linear':
 			this.animations[id] = new LinearAnimation(this.graph.animations[id]['span'],
 														this.graph.animations[id]['controlPoints']);
 			break;
 		case 'circular':
 			this.animations[id] = new CircularAnimation(this.graph.animations[id]['span'],
 													this.graph.animations[id]['center'],
 														this.graph.animations[id]['radius'],
 															degToRad(this.graph.animations[id]['startang']),
 																degToRad(this.graph.animations[id]['rotang']));
 			break;
 		default: break;
 		}

 	// set the nodes' animations as active
 	for(id in this.graph.nodes){
 		var element = this.graph.nodes[id];
 		if(element['activeAnimation']!=undefined)
 			this.animations[element['animations'][element['activeAnimation']]].activate();
 	}
 };

/**
 * loadTextures
 * Load the scene's textures.
 */
MyEnvironment.prototype.loadTextures = function () {

 	this.textures = [];
 	this.amplificationFactor = [];

 	for(id in this.graph.textures){
 		this.textures[id] = new CGFtexture(this.scene, this.graph.textures[id]['file']);
 		this.amplificationFactor[id] = this.graph.textures[id]['amplif_factor'];
 	}
};

/**
 * loadMaterials
 * Create the scene's materials.
 */
MyEnvironment.prototype.loadMaterials = function () {

 	this.materials = [];

 	// default material
 	this.materials['default'] = new  CGFappearance(this.scene);
 	this.materials['default'].setAmbient(.5,.5,.5,.5);
 	this.materials['default'].setDiffuse(.5,.5,.5,.5);
 	this.materials['default'].setSpecular(.5,.5,.5,.5);
 	this.materials['default'].setEmission(.5,.5,.5,.5);
 	this.materials['default'].setShininess(1);
 	this.materials['default'].setTextureWrap("REPEAT","REPEAT");

 	for(id in this.graph.materials){
 		this.materials[id] = new CGFappearance(this.scene);

 		this.materials[id].setAmbient(  this.graph.materials[id]['ambient'][0],
 										this.graph.materials[id]['ambient'][1],
 										this.graph.materials[id]['ambient'][2],
 										this.graph.materials[id]['ambient'][3]);

 		this.materials[id].setDiffuse(  this.graph.materials[id]['diffuse'][0],
 										this.graph.materials[id]['diffuse'][1],
 										this.graph.materials[id]['diffuse'][2],
 										this.graph.materials[id]['diffuse'][3]);

 		this.materials[id].setSpecular( this.graph.materials[id]['specular'][0],
 										this.graph.materials[id]['specular'][1],
 										this.graph.materials[id]['specular'][2],
 										this.graph.materials[id]['specular'][3]);

 		this.materials[id].setEmission( this.graph.materials[id]['emission'][0],
 										this.graph.materials[id]['emission'][1],
 										this.graph.materials[id]['emission'][2],
 										this.graph.materials[id]['emission'][3]);

 		this.materials[id].setShininess(this.graph.materials[id]['shininess']);
 		this.materials[id].setTextureWrap("REPEAT","REPEAT");
 	}
};

/**
 * initShaders
 * Initiate the shaders.
 */
MyEnvironment.prototype.initShaders = function () {
	this.terrainShader = new CGFshader(this.scene.gl, "shaders/terrainShader.vert", "shaders/terrainShader.frag");
	this.terrainShader.setUniformsValues({normScale: 1.0});
	this.terrainShader.setUniformsValues({uSampler2: 1});
};

/**
 * display
 * Display the scene.
 */
MyEnvironment.prototype.display = function () {
  this.scene.pushMatrix();
    this.scene.multMatrix(this.matrix);

   	if (this.graph.loadedOk){
   		this.scene.updateLights();
   		this.processGraph();
   	}

  this.scene.popMatrix();
};

 /**
  * processGraph
  * Processes the scene's elements.
  */
 MyEnvironment.prototype.processGraph = function() {

  	this.materialsUsed = ['default'];
  	this.texturesUsed = ['clear'];

  	this.processElement(this.graph.root);
  };

 /**
  * drawElement
  * Draws the element with elementId with current appearance and tranformation.
  */
 MyEnvironment.prototype.drawElement = function(elementId) {
 	var material = this.materialsUsed.pop();
 	var texture = this.texturesUsed.pop();

 	if(texture!='clear'){
 		this.leaves[elementId].updateTexelCoordinates(this.amplificationFactor[texture][0], this.amplificationFactor[texture][1]);
 		this.materials[material].setTexture(this.textures[texture]);
 	}else this.materials[material].setTexture(null);

 	this.materials[material].apply();

 	if(this.graph.leaves[elementId]['type']=='terrain')
 		this.scene.setActiveShader(this.terrainShader);

 	// draw the element specified
 	this.leaves[elementId].display();

 	if(this.graph.leaves[elementId]['type']=='terrain')
 		this.scene.setActiveShader(this.scene.defaultShader);

 	this.materialsUsed.push(material);
 	this.texturesUsed.push(texture);
 };

 /**
  * processElement
  * Processes element elementId and its descendants.
  * @param elementId
  */
 MyEnvironment.prototype.processElement = function(elementId) {

 	var element = null;

 	// find node or leaf
 	if(this.graph.nodes[elementId] != null)
 		element = this.graph.nodes[elementId];
 	else if(this.graph.leaves[elementId] != null){
 		this.drawElement(elementId);
 		return null;
 	}else return null;

 	// check if the element's material is valid
 	if(this.materials[element['material']] == null || element['material']=="null"){
 		var material = this.materialsUsed.pop();
 		this.materialsUsed.push(material);
 		this.materialsUsed.push(material);
 	}else this.materialsUsed.push(element['material']);

 	// check if the element's texture is valid
 	if(this.textures[element['texture']] == null && element['texture']!="null")
 		this.texturesUsed.push('clear');
 	else if(element['texture']=="null"){
 		var texture = this.texturesUsed.pop();
 		this.texturesUsed.push(texture);
 		this.texturesUsed.push(texture);
 	}else this.texturesUsed.push(element['texture']);

 	this.scene.pushMatrix();

 	if(element['activeAnimation']!=undefined){
 		var animationId = element['animations'][element['activeAnimation']];

 		// determine current animation
 		if(!this.animations[animationId].isActive()){

 			// if there is a next animation
 	    	if(element['activeAnimation']+1<element['animations'].length){
 	    		element['activeAnimation']++;
 	    		animationId = element['animations'][element['activeAnimation']];
 	    		this.animations[animationId].reset();
 	    		this.animations[animationId].activate();

 		    }else{

 		    	if(this.loop){
 		     		element['activeAnimation']=0;
 		     		animationId = element['animations'][element['activeAnimation']];
 		     		this.animations[animationId].reset();
 	    			this.animations[animationId].activate();
 		    	}

 				animationId = element['animations'][element['activeAnimation']];
 		 	}
 		}

 		// Apply animation
 		this.scene.multMatrix(this.animations[animationId].getCurrentTransformation());
 		this.scene.multMatrix(element.matrix);
 		if(this.graph.animations[animationId].type == 'linear'){
 			this.scene.multMatrix(this.animations[animationId].getCurrentOrientation());
 		}

 	}else this.scene.multMatrix(element['matrix']);

 	// check descendants
 	var n;
 	for(n=0; n< element['descendants'].length; n++)
 		this.processElement(element['descendants'][n]);

 	this.scene.popMatrix();
 	this.materialsUsed.pop();
 	this.texturesUsed.pop();
 };
