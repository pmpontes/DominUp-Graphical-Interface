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
  request.onerror = onError || function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
};

PrologServer.prototype.parseStartGame = function(argArray){
  var argumentsArray = JSON.parse(argArray);

  var table = argumentsArray[0];
  var dominoes1 = argumentsArray[1];
  var dominoes2 = argumentsArray[2];

  server.scene.players['player1'].setPieces(dominoes1);
  server.scene.players['player2'].setPieces(dominoes2);
};


//Handle the Reply
PrologServer.prototype.handleReply = function(data){
	if(data.target.response != null && data.target.response != "ok"){
    server.parseStartGame(data.target.response);
  }
	return data.target.response;
};
