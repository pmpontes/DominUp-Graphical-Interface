/**
 * DominupScene
 * @constructor
 */
function DominupScene() {
    CGFscene.call(this);
    this.server = new PrologServer(this);
}

DominupScene.prototype = Object.create(CGFscene.prototype);
DominupScene.prototype.constructor = DominupScene;

/**
 * setMyInterface
 * Sets the scene's interface and creates a menu.
 * @param newInterface
 */
DominupScene.prototype.setMyInterface = function(newInterface) {
	this.myInterface = newInterface;
	this.myInterface.createMainMenu();
}

/*******************************************************
 *                 Game Initialization                 *
 *******************************************************/

/**
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

  this.pieceShader = new CGFshader(this.gl, "shaders/piecesShader.vert", "shaders/piecesShader.frag");
	this.pieceShader.setUniformsValues({normScale: 1});
  this.pieceShader.setUniformsValues({uSampler2: 1});

	this.setUpdatePeriod(30);
	this.setPickEnabled(true);

	// Game settings
	this.initGame();
};

/**
 * initLights
 * Initiate lights over game surface.
 */
DominupScene.prototype.initLights = function () {
  var positions = [[0,10,0],[10,10,0], [-10,10,0]];

  for(var i = 7; i<this.lights.length, i>=5; i--){
    this.lights[i].setPosition(positions[7-i][0],positions[7-i][1],positions[7-i][2],1);
  	this.lights[i].setAmbient(0,0,0,0.5);
  	this.lights[i].setDiffuse(0.9,0.9,0.9,0.5);
  	this.lights[i].setSpecular(1,1,1,0.5);
  	this.lights[i].enable();
  	this.lights[i].update();
  }
};

/**
 * initGame.
 * Initiate the game.
 */
DominupScene.prototype.initGame = function () {
  this.timeout = 60;  // default timeout
  this.statusBoard = new MyStatusBoard(this, 7,7);
	this.state = 'SELECT_GAME_TYPE';
	this.moves = [];
  this.players = [];

  this.pieceGeometry = false;
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
};

/**
 * initGameEnvironment.
 * Create game environment with given name.
 * @param environmentName the name of the environment to create.
 * @param graph the environment's configuration.
 */
DominupScene.prototype.initGameEnvironment = function (environmentName, graph) {
  if(this.gameEnvironments.indexOf(environmentName)!=-1)
    this.environments[environmentName] = new MyEnvironment(this, graph);
  if(this.gameEnvironments.indexOf(environmentName)==0)
	 this.environments[environmentName].activateEnvironment();
};

/**
 * initGameEnvironments.
 * Initiate the scene's environments.
 */
DominupScene.prototype.initGameEnvironments = function () {
  // game environments options
	this.gameEnvironments = ['space', 'road', 'airfield', 'none'];
	this.gameEnvironment = this.gameEnvironments[0];
	this.environments = [];
};

/**
 * initGameLooks
 * Load the textures and create materials for the game's surface and pieces.
 */
DominupScene.prototype.initGameLooks = function () {

	// accepted game looks
	this.gameLooks = ['default', 'wood', 'marble'];
	this.gameLook = this.gameLooks[0];

	this.lookMaterials = [];
	this.lookMaterials['default'] = [];
	this.lookMaterials['default']['ambient'] = [0,0,0,.5];
	this.lookMaterials['default']['diffuse'] = [0.1,0.1,0.1,.5];
	this.lookMaterials['default']['specular'] = [0.5,0.5,0.5,1];
	this.lookMaterials['default']['emission'] = [0,0,0,.5];
	this.lookMaterials['default']['shininess'] = 1;

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

/**
 * initGamePieces.
 * Initiate the game's pieces.
 */
DominupScene.prototype.initGamePieces = function () {
	this.pieces = [];
	var piecesId = 500;  // ID range for domino pieces

  for(var n=0; n<8; n++)
		for(var m=n; m<8; m++){
			this.pieces[[n,m]] = new MyPiece(this, n, m);
			this.pieces[[n,m]].setId(piecesId++);
		}
};

/**
 * initGameSurface.
 * Initiate the game's playing surface.
 */
DominupScene.prototype.initGameSurface = function () {
	this.gameSurface = new GameSurface(this, 10, 10);
};

/**
 * initGamePlayers.
 * Initiate the game's players.
 */
DominupScene.prototype.initGamePlayers = function () {
  this.state = 'PLAY';
  this.gameState = !this.players['player1'].human ? 'AUTO_PLAY' : 'SELECT_PIECE';
  this.responseTime = 0;
  this.autoPlayerTimeout = 1000;

	// send player's info, initiate players in PROLOG
  switch(this.gameType){
    case 'Human-Human':
      this.server.getPrologRequest("playerPlayer");
      break;
    case 'Human-Computer':
      this.server.getPrologRequest("playerComputer(" + this.players['player2'].intLevel + ")");
      break;
    case 'Computer-Computer':
      this.server.getPrologRequest("computerComputer(" + this.players['player1'].intLevel + "," + this.players['player2'].intLevel + ")");
      break;
    }
};

/**
 * initCameras
 * Initiate the game's camera.
 */
DominupScene.prototype.initCameras = function () {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
  this.cameraManager = new MyCameraManager(this);
};

/**
 * setDefaultAppearance
 * Initiate the scene's default appearance.
 */
DominupScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

/*******************************************************
 *                    Game Options                     *
 *******************************************************/

 /**
  * startGame
  * Initiate new game, preparing interfaces.
  */
 DominupScene.prototype.startGame = function(){
   this.myInterface.createGameMenu();
   this.myInterface.destroyNewGameMenu();
   this.commState = "NONE_IN_PROGRESS";
   this.state= 'START_GAME';
   this.responseTime = 0;
   this.cameraManager.changePosition('start');
   this.cameraManager.changePosition('player1 view');
 };

/**
 * newGame
 * Initiate new game, preparing the game state.
 */
DominupScene.prototype.newGame = function(){
  this.turn = 'player1';
  this.moves = [];
  this.responseTime = 0;
  this.autoPlayerTimeout = 0;
	this.initGamePieces();
	this.initGameSurface();
	this.initGamePlayers();
};

/**
 * reviewGame.
 * Pause the game and initiate a review.
 */
DominupScene.prototype.reviewGame = function (){
  if(this.moves.length==0)
    return;

  this.pauseGame = true;
  this.pauseReview = false;
  this.reviewTimePaused = 0;
  this.moveTime = 3000;
  this.myInterface.destroyGameMenu();
  this.myInterface.createReviewMenu();
  this.stateBefore = this.state;
  this.state = 'REVIEW_GAME';

  // copy game state, saving it
  this.turnBefore = this.turn;
  this.turn = 'player1';
  this.cameraManager.changePosition(this.turn + ' view');

  this.reviewMoves = this.moves.slice();

  // create new set of pieces
  this.piecesBefore = this.pieces;
  this.pieces = [];
  for(var n=0; n<8; n++)
    for(var m=n; m<8; m++)
      this.pieces[[n,m]] = new MyPiece(this, n, m);

  // save current game surface and create empty game surface
  this.gameSurfaceBefore = this.gameSurface;
  this.gameSurface = new GameSurface(this, 10, 10);

  // save current players
  this.playersBefore = [];
  this.playersBefore['player1'] = this.players['player1'];
  this.playersBefore['player2'] = this.players['player2'];

  // create copy of players with the initial set of pieces
  this.players['player1'] = this.players['player1'].clone();
  this.players['player2'] = this.players['player2'].clone();

  console.log('review started!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(this.players);
};

/**
 * quitReview.
 * Restore game to previous status.
 */
DominupScene.prototype.quitReview = function(){
  console.log('finish review!!!!!!!');
  this.myInterface.destroyReviewMenu();
  this.state='REVIEW_OVER';

  // restore game state
  this.pieces = this.piecesBefore;  // restore pieces

  // restore current game surface and create empty game surface
  this.gameSurface = this.gameSurfaceBefore;

  // restore current players
  this.players['player1'] = this.playersBefore['player1'];
  this.players['player2'] = this.playersBefore['player2'];
  console.log(this.players);
  this.playersBefore = null;

  this.turn = this.turnBefore;
  this.cameraManager.changePosition(this.turn + ' view');
};

/**
 * quitReview.
 * Restore game to previous status.
 */
DominupScene.prototype.reviewOver = function(){
  console.log('finish review!!!!!!!, state reset');
  this.pauseGame = false;

  this.state=this.stateBefore;
  console.log(this.state);
  this.myInterface.createGameMenu();
};

/*******************************************************
 *                       Game play                     *
 *******************************************************/

/**
 * updateGameState.
 * Update the game's state, related to piece and position selection.
 */
DominupScene.prototype.updateGameState = function(){
	switch(this.state){
		case 'SELECT_GAME_TYPE':
			if(this.gameType == this.gameTypes[1]){
        this.players['player1'] = new Player(this, 'player1');
        this.players['player2'] = new Player(this, 'player2');
        this.startGame();
			}else if(this.gameType == this.gameTypes[2] || this.gameType == this.gameTypes[3]){
				this.state = 'SELECT_GAME_LEVEL_PL1';
				this.myInterface.showGameLevels('player1');
			}
			break;
		case 'SELECT_GAME_LEVEL_PL1':
			if(this.gameLevel != this.gameLevels[0]){
				if(this.gameType == this.gameTypes[2]){
          this.players['player1'] = new Player(this, 'player1');
          this.players['player2'] = new Player(this, 'player2', this.gameLevel);
          this.startGame();
				}else{
					this.players['player1'] = new Player(this, 'player1', this.gameLevel);
					this.state='SELECT_GAME_LEVEL_PL2';
					this.myInterface.showGameLevels('player2');
				}
			}
			break;
		case 'SELECT_GAME_LEVEL_PL2':
			if(this.gameLevel != this.gameLevels[0]){
        this.players['player2'] = new Player(this, 'player2', this.gameLevel);
				this.startGame();
			}
			break;
    case 'START_GAME':
      this.newGame();
      break;
		default: break;
	}
};

/**
 * update.
 * Update the game's state and environment.
 * @param currTime.
 */
DominupScene.prototype.update = function(currTime) {

  // update game environment
  if(this.gameEnvironment in this.environments)
    this.environments[this.gameEnvironment].update(currTime);

	if(!this.pauseGame){
    // update camera's position
    this.cameraManager.update(currTime-this.timePaused);

    if(this.gameState!='GAME_OVER' && this.timeout!=0 && this.responseTime>=this.timeout*1000){
      console.log('timeout');
      this.turn = (this.turn == 'player1') ? 'player2' : 'player1';

      if(!this.players[this.turn].human){
        this.autoPlayerTimeout = 0;
        this.gameState = 'AUTO_PLAY';
      }else this.gameState = 'SELECT_PIECE';

      if(this.selectedPieceId!=undefined)
    	   this.unselectPiece();

      this.prepareTurn();
    }else if(this.previousTime!=undefined)
      this.responseTime += currTime-this.previousTime;

    for(pieceId in this.pieces)
        this.pieces[pieceId].update(currTime-this.timePaused);

    if(this.gameState=='AUTO_PLAY') {
      if(this.autoPlayerTimeout >=2000) {
        this.autoPlayerTimeout=0;
        this.makeMove();
      }else this.autoPlayerTimeout += currTime-this.previousTime;
    }

    if(this.gameState=='NEXT_PLAYER') {
      if(this.animationTimeout >=3000) {
        this.proceedWithGame();
      }else this.animationTimeout+= currTime-this.previousTime;
    }

		this.updateGameState();
	}else this.timePaused += (currTime - this.previousTime);

  if(this.state=='REVIEW_OVER') {
    // update camera's animation
    if(!this.cameraManager.update(currTime-this.timePaused))
      this.reviewOver();

  }else if(this.state=='REVIEW_GAME'){
    if(!this.pauseReview){
      console.log('update review');

      // update camera's animation
      this.cameraManager.update(currTime-this.reviewTimePaused);

      if(this.moveTime<5000 && this.previousTime!=undefined)
          this.moveTime += currTime-this.previousTime;
      else{
        console.log('make move time:' + this.moveTime);
        this.moveTime=0;
        this.reviewMakeMove();
      }

      for(pieceId in this.pieces)
        this.pieces[pieceId].update(currTime-this.reviewTimePaused);

    }else this.reviewTimePaused += (currTime - this.previousTime);
  }

	this.previousTime = currTime;
};

/**
 * updateLights
 * Update the lights.
 */
DominupScene.prototype.updateLights = function() {
	for (var i = 0; i < this.lights.length; i++){
    if(i>=5){
      if((this.state == 'PLAY' && this.pauseGame) ||
          (this.state == 'REVIEW_GAME' && this.pauseReview)){
        this.lights[i].disable();
      }else this.lights[i].enable();
    }
		this.lights[i].update();
  }
}

/**
 * isGameOver.
 * Check if the game is over.
 * @return the player who won, false otherwise.
 */
DominupScene.prototype.isGameOver = function (){
  for(playerId in this.players)
    if(this.players[playerId].pieces.length==0)
      return playerId;

  return false;
};

/**
 * undoLastMove.
 * Undo the last move, updating game state.
 */
DominupScene.prototype.undoLastMove = function (){

  console.log('undo');
  if(this.moves.length==0)
    return;

  var lastPlay = this.moves.pop();

  // remove piece from game surface and return piece to player
  this.gameSurface.unplacePiece(this.pieces[lastPlay['piece']].getValues());
  this.players[lastPlay['player']].addPiece(this.pieces[lastPlay['piece']].getValues());

  // do animation to piece
  this.pieces[lastPlay['piece']].unplaceAnimation(3, lastPlay.position, lastPlay['player']);
  server.scene.gameState = 'NEXT_PLAYER';
  server.scene.animationTimeout = 0;

  console.log('play undone ' + lastPlay['player']);
  // change turn
  this.nextPlayer = lastPlay['player'];

  // update status on prolog server
  var requestString = "setGameState(" + this.gameSurface.getTable() + "," +
                    this.players['player1'].getPieces('string') + "," +
                    this.players['player2'].getPieces('string') + ")";
  this.server.getPrologRequest(requestString);
};

/**
 * prepareTurn.
 * Prepare new move, handling the camera animation. Turn must be properly set.
 */
DominupScene.prototype.prepareTurn = function (){
  // update camera view
  this.cameraManager.changePosition(this.turn + ' view');

  this.responseTime = 0;
  this.selectedPieceId = undefined;
  this.selectedPiece = undefined;
};

/**
 * hintMove.
 * Make request to Prolog server for possible plays.
 */
DominupScene.prototype.hintMove = function (){

  // make play in Prolog
  var requestString = "hintPlay(" + this.players[this.turn].playerId + ")";
  this.server.getPrologRequest(requestString);
};

/**
 * makeMove.
 * Moves the piece selected to the position chosen.
 */
DominupScene.prototype.makeMove = function (){

 console.log("piece and location chosen, make move");

  if((winner = this.isGameOver())!=false) {
   console.log('gameOver');
   this.gameState = 'GAME_OVER';
   return;
  }

  var requestString;

  // make play in Prolog
  if(this.players[this.turn].human){
    requestString = "makeMove(" + this.players[this.turn].playerId + ",[" + this.selectedPiece + "]-["
                                    + this.posA[0] + "," + this.posA[1] + "]-["
                                    + this.posB[0] + "," + this.posB[1] + "])";
  } else requestString = "makeMove(" + this.players[this.turn].playerId + ")";

  this.server.getPrologRequest(requestString);
};

/**
 * proceedWithMove.
 * Processes a play AFTER communicating with the prolog server and the animation of the previous move has ended
 */
DominupScene.prototype.proceedWithGame = function (){
  // check if game over
  var winner;
  if((winner = this.isGameOver())!=false) {
    console.log('gameOver');
    this.gameState = 'GAME_OVER';
    return;
  }

  if(!this.players[this.turn].human){
    this.autoPlayerTimeout = 0;
    this.gameState = 'AUTO_PLAY';
  }else this.gameState = 'SELECT_PIECE';

  // prepare next player
  this.turn = this.nextPlayer;
  this.prepareTurn();
}

/**
 * reviewMakeMove.
 * Moves the piece selected to the position chosen.
 */
DominupScene.prototype.reviewMakeMove = function (){
    // check if game over
    if(this.reviewMoves.length==0) {
      console.log('review over');
      this.quitReview();
      return;
    }

    var currentMove = this.reviewMoves.shift();
    this.turn = currentMove.player;
    console.log('review move ' + currentMove.player);
    console.log('review move piece moved' + this.pieces[currentMove.piece]);

    // update set of player's dominoes
    this.gameSurface.placePiece(currentMove.position, this.pieces[currentMove.piece].getValues());
    this.players[currentMove.player].removePiece(this.pieces[currentMove.piece].getValues());
    console.log(this.players[currentMove.player].pieces);

    this.pieces[currentMove.piece].createAnimation(3, currentMove.position);

    console.log('review: ' + currentMove);

    this.cameraManager.changePosition(this.turn + ' view');
};

/**
 * checkPosition.
 * Check if the given positions are adjacent.
 * @param posA.
 * @param posB.
 * @return true if the positions are adjacent, false otherwise.
 */
function checkPosition(posA, posB){
  if((Math.abs(posA[0]-posB[0])==1 && posA[1]==posB[1])
    || (posA[0]==posB[0] && Math.abs(posA[1]-posB[1])==1))
      return true;
  else return false;
}

/*******************************************************
 *                   Game Interface                    *
 *******************************************************/

/**
 * pieceSelected.
 * Handle piece selection.
 * @param id the piece's id.
 * @param timout.
 */
DominupScene.prototype.pieceSelected = function (id, timout){
	if(this.selectedPieceId!=undefined){
	   // do anitation to old piece
     for(piece in this.pieces)
      if(this.pieces[piece].getId()==this.selectedPieceId){
        this.pieces[piece].unselected();
        break;
      }
	}

	this.selectedPieceId=id;
  this.gameState='SELECT_LOCATION_A';

	// do animation to new piece
  for(piece in this.pieces)
   if(this.pieces[piece].getId()==id){
     this.selectedPiece=this.pieces[piece].getValues();
     this.pieces[piece].selected();
     console.log("pieceSelected " + piece);
     break;
   }

   this.cameraManager.changePosition('board view', 3000);
};

/**
 * unselectPiece.
 * Remove selection animation from currently piece selected.
 * @param id the piece's id.
 * @param timout.
 */
DominupScene.prototype.unselectPiece = function (){
  // unselect piece
  this.gameState='SELECT_PIECE';

  for(piece in this.pieces)
   if(this.pieces[piece].getId()==this.selectedPieceId){
     this.pieces[piece].unselected();
     break;
   }

  this.selectedPieceId = undefined;
  this.selectedPiece = undefined;
};

/**
 * pickManager.
 * Manage action after object with the given id is picked.
 * @param id the id of the object picked.
 */
DominupScene.prototype.pickManager = function (id){
  if(this.pauseGame)
    return;

	// if a piece was picked
	if(id>=500){
    console.log("piecetouched " + id);
    if(this.selectedPieceId==id){
      this.unselectPiece();
      this.cameraManager.changePosition(this.turn + ' view');
    }else this.pieceSelected(id);

	}else{
    console.log('position selected' + this.gameSurface.getPosition(id));

  	// if a position was picked
		if(this.gameState=='SELECT_LOCATION_A'){
			this.posA = this.gameSurface.getPosition(id);
      this.gameState='SELECT_LOCATION_B';
    }else if(this.gameState=='SELECT_LOCATION_B'){
			this.posB = this.gameSurface.getPosition(id);

      // check if valid combination
      if(!checkPosition(this.posA, this.posB))
        this.posA = this.gameSurface.getPosition(id);
      else{
        this.cameraManager.changePosition(this.turn + ' view',1000);
        this.makeMove();
      }
		}
	}
};

/**
 * logPicking.
 * Handle picking.
 */
DominupScene.prototype.logPicking = function (){
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj){
					var customId = this.pickResults[i][1];
					this.pickManager(customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

/**
 * display.
 * Display the game scene.
 */
DominupScene.prototype.display = function () {
  // Clear image and depth buffer every time we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
  this.gl.enable(this.gl.DEPTH_TEST);

	// Initialize Model-View
	this.updateProjectionMatrix();
  this.loadIdentity();

  this.pushMatrix();
    this.translate(-3.65,1.2,-10);
    this.scale(0.2,0.2,0.2);
    this.statusBoard.display();
  this.popMatrix();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
  this.multMatrix(this.cameraManager.getCurrentTransformation());

	this.setDefaultAppearance();

	this.logPicking();
	this.clearPickRegistration();

  // display game environment when ready
  if(!this.pickMode && (this.gameEnvironment in this.environments))
	  this.environments[this.gameEnvironment].display();

  this.updateLights();

	if(this.state == 'PLAY' || this.state == 'REVIEW_GAME' || this.state == 'REVIEW_OVER'){
    this.pushMatrix();
      this.scale(.9,.9,.9);
      this.translate(-5,0,-5);
      this.players['player1'].showDominoes();
      this.players['player2'].showDominoes();
      this.gameSurface.display();
    this.popMatrix();
	}
};
