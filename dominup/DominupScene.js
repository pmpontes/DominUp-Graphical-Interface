/*
 * DominupScene
 * @constructor
 */
function DominupScene() {
    CGFscene.call(this);
    this.server = new PrologServer(this);
}

DominupScene.prototype = Object.create(CGFscene.prototype);
DominupScene.prototype.constructor = DominupScene;

/*
 * setMyInterface
 * Sets the scene's interface and creates a menu.
 * @param newInterface
 */
DominupScene.prototype.setMyInterface = function(newInterface) {
	this.myInterface = newInterface;
	this.myInterface.createMainMenu();
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

  this.pieceShader = new CGFshader(this.gl, "shaders/piecesShader.vert", "shaders/piecesShader.frag");
	this.pieceShader.setUniformsValues({normScale: 1.0});
	this.pieceShader.setUniformsValues({uSampler2: 1});

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
  this.turn = 'player1';
  this.moves = [];
  this.responseTime = 0;
  this.autoPlayerTimeout = 0;
	this.initGamePieces();
	this.initGameSurface();
	this.initGamePlayers();
};

DominupScene.prototype.endGame = function(winner){
  // show winner
  console.log(winner);
  this.gameState = 'GAME_OVER';
};

/*
 * reviewGame.
 * Pauses the game and initiates a review.
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
  this.state = 'REVIEW_GAME';

  // copy game state, saving it
  this.reviewMoves = this.moves.slice();
  this.reviewTurn = this.reviewMoves[0].player;
  this.updateCameraPosition(this.reviewTurn + ' view');
  this.piecesBeforeReview = this.pieces;

  // create new set of pieces
  this.pieces = [];
  for(var n=0; n<8; n++)
    for(var m=n; m<8; m++)
      this.pieces[[n,m]] = new MyPiece(this, n, m);

  // create empty game surface
  this.reviewGameSurface = new GameSurface(this, 10, 10);

  // create copy of players with the initial set of pieces
  this.reviewPlayers = [];
  this.reviewPlayers['player1'] = this.players['player1'].clone();
  this.reviewPlayers['player2'] = this.players['player2'].clone();

  console.log('review started!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(this.reviewPlayers);
};

DominupScene.prototype.quitReview = function(){
  console.log('finish review!!!!!!!');
  this.myInterface.destroyReviewMenu();
  this.state='REVIEW_OVER';
  this.updateCameraPosition(this.turn + ' view');
};

DominupScene.prototype.reviewOver = function(){
  console.log('finish review!!!!!!!');
  this.pauseGame = false;
  this.pieces = this.piecesBeforeReview;  // restore pieces
  if(!this.isGameOver()) {
    console.log('keep playnig');
    this.state='PLAY';
    this.myInterface.createGameMenu();
  }
};

DominupScene.prototype.startGame = function(){
  this.myInterface.createGameMenu();
  this.myInterface.destroyNewGameMenu();
  this.commState = "NONE_IN_PROGRESS";
  this.state= 'START_GAME';
  this.responseTime = 0;
  this.cameraAnimation = new CircularAnimation(2, [0,0,0], 0, 0,-Math.PI/4);
  this.cameraAnimation.activate();
  mat4.identity(this.cameraMatrix);
};

/*
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
    case 'PLAY':
      this.updateCameraPosition();
      break;
		default: break;
	}
};

/*
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
    if(this.cameraAnimation!=undefined && this.cameraAnimation.isActive())
        this.cameraAnimation.update(currTime-this.timePaused);

    if(this.timeout!=0 && this.responseTime>=this.timeout*1000){
      console.log('timeout');
      this.turn = (this.turn == 'player1') ? 'player2' : 'player1';

      if(this.selectedPieceId!=undefined)
    	   this.unselectPiece();

      this.prepareTurn();
    }else if(this.previousTime!=undefined)
      this.responseTime += currTime-this.previousTime;

    for(pieceId in this.pieces)
        this.pieces[pieceId].update(currTime-this.timePaused);

    if(this.gameState=='AUTO_PLAY' && this.autoPlayerTimeout >=3000){
      this.autoPlayerTimeout=0;
      this.makeMove();
    }else this.autoPlayerTimeout += currTime-this.previousTime;

		this.updateGameState();
	}else this.timePaused += (currTime - this.previousTime);

  if(this.state=='REVIEW_OVER') {
    // update camera's animation
    if(this.cameraAnimation!=undefined && this.cameraAnimation.isActive())
        this.cameraAnimation.update(currTime-this.reviewTimePaused);
    else this.reviewOver();

  }else if(this.state=='REVIEW_GAME'){
    if(!this.pauseReview){
      console.log('update review');

      // update camera's animation
      if(this.cameraAnimation!=undefined && this.cameraAnimation.isActive())
          this.cameraAnimation.update(currTime-this.reviewTimePaused);

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

/*
 * initGame.
 * Initiate the game.
 */
DominupScene.prototype.initGame = function () {
  this.timeout = 60;  // default timeout
  this.statusBoard = new MyStatusBoard(this, 5,5);
	this.state = 'SELECT_GAME_TYPE';
	this.moves = [];
  this.players = [];

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

/*
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

/*
 * initGameEnvironments.
 * Initiate the scene's environments.
 */
DominupScene.prototype.initGameEnvironments = function () {
  // game environments options
	this.gameEnvironments = ['space', 'road', 'airfield'];
	this.gameEnvironment = this.gameEnvironments[0];
	this.environments = [];
};

/*
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

/*
 * initGameSurface.
 * Initiate the game's playing surface.
 */
DominupScene.prototype.initGameSurface = function () {
	this.gameSurface = new GameSurface(this, 10, 10);
};

/*
 * initGamePlayers.
 * Initiate the game's players.
 */
DominupScene.prototype.initGamePlayers = function () {
  this.state = 'PLAY';
  this.gameState = !this.players['player1'].human ? 'AUTO_PLAY' : 'SELECT_PIECE';

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

/*
 * updateCameraPosition.
 * Update the camera's position.
 */
DominupScene.prototype.updateCameraPosition = function (newPosition) {
  if(newPosition=='360 view') {
    if(this.cameraAnimation!=undefined)
      mat4.mul(this.cameraMatrix, this.cameraMatrix, this.cameraAnimation.getCurrentTransformation());

    this.cameraAnimation = new CircularAnimation(8, [0,0,0], 0, 0, -2*Math.PI);
    this.cameraAnimation.activate();
    return;
  }else if(newPosition!=undefined)
    this.cameraPosition = newPosition;

  if(this.curCameraPosition=='leaving board view' && this.cameraAnimation.isActive())
    return;

  if(this.cameraPosition!=this.curCameraPosition){
    console.log('cameraPositionChanged to ' + this.cameraPosition);
    console.log('from ' + this.curCameraPosition);

    if(this.cameraAnimation!=undefined)
      mat4.mul(this.cameraMatrix, this.cameraMatrix, this.cameraAnimation.getCurrentTransformation());

    switch (this.cameraPosition) {
      case 'player1 view':
      case 'player2 view':
        if(this.curCameraPosition=='board view'){
          this.curCameraPosition=='leaving board view';
          this.cameraAnimation = new CircularAnimation(2, [0,0,0], 0, 0, -Math.PI/4);
          this.cameraAnimation.activate();
          return;
        }else this.cameraAnimation = new CircularAnimation(2, [0,0,0], 0, 0, -Math.PI);
        break;
      case 'board view':
      // TODO rotation???
        this.cameraAnimation = new CircularAnimation(2, [0,0,0], 0, 0, Math.PI/4);
        break;
    }

    this.cameraAnimation.activate();
    this.curCameraPosition = this.cameraPosition;
  }
};

/*
 * initCameras
 * Initiate the game's camera.
 */
DominupScene.prototype.initCameras = function () {
  this.cameraPositions = ['player1 view', 'player2 view', 'board view'];
  this.curCameraPosition = this.cameraPositions[0];
  this.cameraPosition = this.cameraPositions[0];

  this.cameraMatrix = mat4.create();
  mat4.identity(this.cameraMatrix);

  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
  this.cameraAnimation = undefined;
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

/*
 * pieceSelected.
 * Handle piece selection.
 * @param id the piece's id.
 */
DominupScene.prototype.pieceSelected = function (id){
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
};

/*
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

/*
 * undoLastMove.
 * Undo the last move, updating game state.
 */
DominupScene.prototype.undoLastMove = function (){
  console.log('undo');
  if(this.moves.length==0)
    return;

  var lastPlay = this.moves.pop();

  // do animation to piece


  // remove piece from game surface and return piece to player
  this.gameSurface.unplacePiece(this.pieces[lastPlay['piece']].getValues());
  this.players[lastPlay['player']].addPiece(this.pieces[lastPlay['piece']].getValues());

  // change turn
  this.turn = (this.moves.length==0) ? 'player1' : this.moves[this.moves.length-1]['player'];
  this.prepareTurn();
  if(!this.players[this.turn].human) {
    this.gameState = 'AUTO_PLAY';
    this.autoPlayerTimeout = 0;
  }else this.gameState = 'SELECT_PIECE';

  console.log(this.turn);
  console.log(this.gameSurface.getTable()+"");
  console.log(this.players['player1'].getPieces('string'));
  var requestString = "setGameState(" + this.gameSurface.getTable() + "," +
                    this.players['player1'].getPieces('string') + "," +
                    this.players['player2'].getPieces('string') + ")";
  this.server.getPrologRequest(requestString);
};

/*
 * prepareTurn.
 * Prepare new move, handling the camera animation. Turn must be properly set.
 */
DominupScene.prototype.prepareTurn = function (){
  // update camera view
  if(this.curCameraPosition!=this.turn + ' view')
    this.updateCameraPosition(this.turn + ' view');

  this.responseTime = 0;
  this.selectedPieceId = undefined;
  this.selectedPiece = undefined;
};


/*
 * makeMove.
 * Moves the piece selected to the position chosen.
 */
DominupScene.prototype.makeMove = function (){
 console.log("piece and location chosen, make move");

  var requestString;

  // make play in Prolog
  if(this.players[this.turn].human){
    requestString = "makeMove(" + this.players[this.turn].playerId + ",[" + this.selectedPiece + "]-["
                                    + this.posA[0] + "," + this.posA[1] + "]-["
                                    + this.posB[0] + "," + this.posB[1] + "])";
  } else requestString = "makeMove(" + this.players[this.turn].playerId + ")";

  this.server.getPrologRequest(requestString);

  // save move
  /*var positionSelected = {aX: this.posA[0], aY: this.posA[1], bX: this.posB[0], bY: this.posB[1]};
  this.moves.push({player: this.turn, piece: this.selectedPiece, position: positionSelected});*/
};


/*
 * proceedWithMove.
 * Processes a play AFTER communicating with the prolog server and the animation of the previous move has ended
 */
DominupScene.prototype.proceedWithMove = function (nextPlayer){
  // check if game over
  var winner;
  if((winner = this.isGameOver())!=false) {
    console.log('gameOver');
    this.endGame(winner);
    return;
  }

  // if !human, generate play
  if(!this.players[this.turn].human){
    this.autoPlayerTimeout = 0;
    this.gameState = 'AUTO_PLAY';
  }else this.gameState = 'SELECT_PIECE';

  // prepare next player
  this.turn = nextPlayer;
  this.prepareTurn();
}

/*
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
    this.reviewTurn = currentMove.player;
    console.log('review move ' + currentMove.player);
    console.log('review move piece moved' + this.pieces[currentMove.piece]);
    // update set of player's dominoes
    var newPiecePosition = this.reviewGameSurface.placePiece(currentMove.position, this.pieces[currentMove.piece].getValues());
    this.reviewPlayers[currentMove.player].removePiece(this.pieces[currentMove.piece].getValues());

    console.log(this.reviewPlayers[currentMove.player].pieces);

    // TODO set piece animation, calculating final position
    this.pieces[currentMove.piece].createAnimation(3, newPiecePosition);

    console.log('review: ' + currentMove);

    if(this.curCameraPosition!=this.reviewTurn + ' view')
      this.updateCameraPosition(this.reviewTurn + ' view');
};

/*
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

/*
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
    if(this.selectedPieceId==id)
      this.unselectPiece();
    else this.pieceSelected(id);

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
      else this.makeMove();
		}
	}
};

/*
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

/*
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
    if(this.cameraAnimation!=undefined)
      this.multMatrix(this.cameraAnimation.getCurrentTransformation());
  this.multMatrix(this.cameraMatrix);

	this.setDefaultAppearance();
	this.updateLights();

	this.logPicking();
	this.clearPickRegistration();

  // display game environment when ready
  if(!this.pickMode && (this.gameEnvironment in this.environments))
	  this.environments[this.gameEnvironment].display();

	if(this.state == 'PLAY'){
    this.pushMatrix();
      this.scale(.9,.9,.9);
      this.translate(-5,0,-5);
      this.players['player1'].showDominoes();
      this.players['player2'].showDominoes();
      this.gameSurface.display();
    this.popMatrix();
	}else if(this.state == 'REVIEW_GAME' || this.state == 'REVIEW_OVER'){
    this.pushMatrix();
      this.scale(.9,.9,.9);
      this.translate(-5,0,-5);
      this.reviewPlayers['player1'].showDominoes();
      this.reviewPlayers['player2'].showDominoes();
      this.reviewGameSurface.display();
    this.popMatrix();
  }
};
