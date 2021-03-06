server = null;

/**
 * Prolog
 * @constructor
 * @param scene
 */
function PrologServer(scene){
  this.scene = scene;
  server = this;
}

/**
 * getPrologRequest
 * Generates a request to Prolog server.
 * @param requestString
 */
PrologServer.prototype.getPrologRequest = function(requestString){
  this.scene.commState = "IN_PROGRESS";
  var requestPort = 8081;
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

  request.onload = this.handleReply || function(data){console.log("Request successful. Reply: " + data.target.response);};
  request.onerror = function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
};

/**
 * handleReply
 * Handles a reply to a Prolog request.
 * @param data
 * @return data.target.response
 */
PrologServer.prototype.handleReply = function(data){
	if(data.target.response != null && data.target.response != "ok"
    && data.target.response != "Syntax Error" && data.target.response != "Bad Request"){

    // parse server response
    var argumentsArray = JSON.parse(data.target.response);
    console.log('Response code:' + argumentsArray[0]);
    // handle reply
    switch(argumentsArray[0]){
      case 0:
        server.parseStartGame(argumentsArray);
        break;
      case 1:
      case 2:
        server.parseMove(argumentsArray);
        break;
      case 3:
        if(argumentsArray[1]!='ok')
          console.log('Impossible to undo last move.');
        break;
      case 4:
        server.parseHint(argumentsArray);
        break;
      case 5:
        console.log('Impossible to hint play.');
        break;
      default:
        console.log('Unkown server error.');
        break;
    }
  } else {
    console.log(data.target.response);
  }

  server.scene.commState = "NONE_IN_PROGRESS";
	return data.target.response;
};

/**
 * parseStartGame
 * Parses information sent by Prolog server about a new game.
 * @param argArray
 */
PrologServer.prototype.parseStartGame = function(argArray){
  var dominoes1 = argArray[2];
  var dominoes2 = argArray[3];

  var next = (server.scene.turn == 'player1') ? 'player2' : 'player1';

  server.scene.players[server.scene.turn].setPieces(dominoes1);
  server.scene.players[next].setPieces(dominoes2);
};

/**
 * parseMove
 * Parses information sent by Prolog server about a move, updating game status accordingly.
 * @param argArray
 */
PrologServer.prototype.parseMove = function(argArray){
  if(argArray[0]==2){
    console.log('Invalid move.');
    server.scene.unselectPiece();
    server.scene.cameraManager.changePosition(server.scene.turn + ' view');
  }else if(argArray[0]==1) {
    var move = argArray[1];
    var dominoes1 = argArray[2];
    var dominoes2 = argArray[3];

    var position = {aX: move[1][0], aY: move[1][1], bX: move[2][0], bY: move[2][1]};
    var domino = [move[0][0], move[0][1]];

    console.log('Valid move.');

    // add piece to game surface
    server.scene.gameSurface.placePiece(position, domino);
    // save move
    server.scene.moves.push({player: server.scene.turn, piece: domino, position: position});

    // set piece animation, calculating final position
    if(!server.scene.players[server.scene.turn].human){
      server.scene.pieces[domino].createAnimation(3, position);
    } else server.scene.pieces[server.scene.selectedPiece].createAnimation(3, position);

    // save player's dominoes
    server.scene.players['player1'].pieces = dominoes1.slice();
    server.scene.players['player2'].pieces = dominoes2.slice();

    // determine next plane and continue game
    server.scene.nextPlayer = (argArray[4]==1) ? 'player1' : 'player2';
    server.scene.gameState = 'NEXT_PLAYER';
    server.scene.animationTimeout = 0;
  }
};

/**
 * parseHint
 * Parses information sent by Prolog server about a possible move, updating game status accordingly.
 * @param argArray
 */
PrologServer.prototype.parseHint = function(argArray){
    var domino = [argArray[1][0], argArray[1][1]];

    if(server.scene.selectedPiece)
      server.scene.pieces[server.scene.selectedPiece].unselected();

    server.scene.gameState = 'SELECT_LOCATION_A';
    server.scene.selectedPiece = domino;
    server.scene.pieces[domino].selected();
    server.scene.cameraManager.changePosition('board view', 5000);
};
