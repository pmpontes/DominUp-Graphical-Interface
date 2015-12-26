server = null;
function PrologServer(scene){
  this.scene = scene;
  server = this;
}

PrologServer.prototype.getPrologRequest = function(requestString, onSuccess, onError, port){
  var requestPort = port || 8081
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

  request.onload = this.handleReply || function(data){console.log("Request successful. Reply: " + data.target.response);};
  request.onerror = onError || function(){console.log("Error waiting for response");alert("Check if prolog server is up!");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
};

//Handle the Reply
PrologServer.prototype.handleReply = function(data){
	if(data.target.response != null && data.target.response != "ok" && data.target.response != "Syntax Error" && data.target.response != "Bad Request"){
    var argumentsArray = JSON.parse(data.target.response);
    switch(argumentsArray[0]){
      case 0:
        server.parseStartGame(argumentsArray);
        break;
      case 1:
        server.parseMove(argumentsArray);
        break;
    }
  } else {console.log(data.target.response);}
	return data.target.response;
};

PrologServer.prototype.parseStartGame = function(argArray){
  var dominoes1 = argArray[2];
  var dominoes2 = argArray[3];

  var next = (server.scene.turn == 'player1') ? 'player2' : 'player1';

  server.scene.players[server.scene.turn].setPieces(dominoes1);
  server.scene.players[next].setPieces(dominoes2);
};

PrologServer.prototype.parseMove = function(argArray){
  var move = argArray[1];
  var dominoes1 = argArray[2];
  var dominoes2 = argArray[3];

  var next = (server.scene.turn == 'player1') ? 'player2' : 'player1';

  var position = {aX: move[1][0], aY: move[1][1], bX: move[2][0], bY: move[2][1]};
  var domino = [move[0][0], move[0][1]];

  server.scene.gameSurface.placePiece(position, domino);

  server.scene.players[server.scene.turn].setPieces(dominoes1);
  server.scene.players[next].setPieces(dominoes2);
};
