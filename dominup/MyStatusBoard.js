/**
 * MyStatusBoard
 * @constructor
 * @param scene
 * @param sizeX
 * @param sizeY
 */
function MyStatusBoard(scene, sizeX, sizeY) {
    CGFobject.call(this,scene);

    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.appearance = new CGFappearance(this.scene);
    this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.appearance.setShininess(120);

    this.board = new CGFappearance(this.scene);
    this.board.setAmbient(0.3, 0.3, 0.3, 1);
    this.board.setDiffuse(0.7, 0.7, 0.7, 1);
    this.board.setSpecular(0.0, 0.0, 0.0, 1);
    this.board.setShininess(120);

    // font texture: 16 x 16 characters
    // http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
    this.fontTexture = new CGFtexture(this.scene, "textures/oolite-font.png");
    this.appearance.setTexture(this.fontTexture);

    this.boardTexture = new CGFtexture(this.scene, "textures/background.png");
    this.board.setTexture(this.boardTexture);

    // plane where texture character will be rendered
    this.plane= new Board(this.scene);

    // instatiate text shader
    this.textShader=new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");

    // set number of rows and columns in font texture
    this.textShader.setUniformsValues({'dims': [16, 16]});

    this.text = 'Dominup';
    this.result1 = undefined;
    this.result2 = undefined;
};

MyStatusBoard.prototype = Object.create(CGFobject.prototype);
MyStatusBoard.prototype.constructor=MyStatusBoard;

/**
 * getLocation.
 * Get the coordenates of a given character.
 * @param character.
 * @return position in format [column, line].
 */
function getLocation(character) {
    var line;
    var column;

   if(character=='-'){
        line=2;
        column=13;
    }else if(character=='.'){
          line=2;
          column=14;
    }else if(character==':'){
        line=3;
        column=10;
    }else if(character>='0' && character<='9'){
        line=3;
        column=parseInt(character);
    }else if(character>='A' && character<='O'){
        line=4;
        column= 1 + character.charCodeAt(0) - 'A'.charCodeAt(0);
    }else if(character>='P' && character<='Z'){
        line=5;
        column= character.charCodeAt(0) - 'P'.charCodeAt(0);
    }else if(character>='a' && character<='o'){
        line=6;
        column= 1 + character.charCodeAt(0) - 'a'.charCodeAt(0);
    }else if(character>='p' && character<='z'){
        line=7;
        column= character.charCodeAt(0) - 'p'.charCodeAt(0);
    }else{
        line=2;
        column=0;
    }

    return [column, line];
};

/**
 * showString.
 * Displays a text string according to specified size.
 * @param text.
 * @param size.
 */
MyStatusBoard.prototype.showString = function (text, size) {

    this.scene.pushMatrix();

    if(size)
        this.scene.scale(size,size,size);

    for(var i=0; i<text.length; i++){

      this.scene.activeShader.setUniformsValues({'charCoords': getLocation(text[i])});
      this.plane.display();

      this.scene.translate(0.8,0,0);
    }

    this.scene.popMatrix();
};

/**
 * showGameState.
 * Displays information about the game's state.
 */
MyStatusBoard.prototype.showGameState = function () {
  // show game result
  this.showString(this.text);
  this.scene.translate(0,-1,0);
  this.showString(this.scene.players['player1'].pieces.length + '-' + this.scene.players['player2'].pieces.length);

  this.scene.translate(0,-1.5,0);

  // show player
  if(this.scene.pauseGame) {
    this.showString('Game paused', .6);
  }else{
    this.showString(this.scene.turn, .8);
    this.scene.translate(0,-0.8,0);
    this.showString(this.scene.players[this.scene.turn].pieces.length + ' pieces left', .5);

    // show time left to make move
    if(this.scene.timeout!=0){
      var responseTime = Math.round(this.scene.timeout - this.scene.responseTime/1000);
      this.scene.translate(0,-1,0);

      if(responseTime%60 < 10)
        this.showString(Math.floor(responseTime/60) + ':0' + responseTime%60);
      else this.showString(Math.floor(responseTime/60) + ':' + responseTime%60);
    }
    this.scene.translate(0,-1,0);
    if(this.scene.players[this.scene.turn].human)
      this.showString('Make a move...', .4);
    else this.showString('Making a move...', .4);
  }
};

/**
 * showGameState.
 * Displays information about the game's state.
 */
MyStatusBoard.prototype.showReviewState = function () {
  // show game result
  this.showString(this.text);
  this.scene.translate(0,-1,0);
  this.showString(this.scene.players['player1'].pieces.length + '-' + this.scene.players['player2'].pieces.length);

  // show player
  this.scene.translate(0,-1.5,0);
  this.showString(this.scene.turn, .8);
  this.scene.translate(0,-0.8,0);
  this.showString(this.scene.players[this.scene.turn].pieces.length + ' pieces left', .5);

  this.scene.translate(0,-1.5,0);
  this.showString('Game review', .5);
};

/**
 * display.
 * Displays information about the game, according to its state.
 */
MyStatusBoard.prototype.display = function () {
  if(!this.scene.pickMode &&
    (this.scene.state == 'PLAY' || this.scene.state == 'REVIEW_GAME' || this.scene.state == 'REVIEW_OVER')) {
    this.scene.pushMatrix();
      this.scene.scale(this.sizeX,this.sizeY,1);
      this.board.apply();
      this.plane.display();
    this.scene.popMatrix();

    // activate shader for rendering text characters
    this.scene.setActiveShaderSimple(this.textShader);

    // activate texture containing the font
    this.appearance.apply();

    this.scene.pushMatrix();
        this.scene.translate(-2.5,2.5,0);

        if(this.scene.state == 'PLAY'
        && this.scene.players['player1'].initialPieceSet!=undefined
        && this.scene.players['player2'].initialPieceSet!=undefined) {
          var winner = null;
          if((winner=this.scene.isGameOver())!=false) {
            // show game result
            this.showString(this.text);
            this.scene.translate(0,-1.5,0);
            this.showString(winner + ' won', .6);
          }else this.showGameState();
        }else if(this.scene.state == 'REVIEW_GAME'){
          this.showReviewState();
        }else if(this.scene.state == 'REVIEW_OVER'){
          // show game result
          this.showString(this.text);
          this.scene.translate(0,-1.5,0);
          this.showString('Review over...', .5);
        }
    this.scene.popMatrix();

    this.scene.setActiveShaderSimple(this.scene.defaultShader);
  }
};
