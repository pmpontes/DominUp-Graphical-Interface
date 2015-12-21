function PrologServer(scene, port){
  this.requestPort = port || 8801;
  this.scene = scene;
}

PrologServer.prototype.getPrologRequest = function(requestString, onSuccess, onError){
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+this.requestPort+'/'+requestString, true);

	request.onload = handleReply || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
}


//Handle the Reply
function handleReply(data){
	if(data != null && data != "ok")
    parseStartGame(data);
	return data.target.response;
}

function parseStartGame(argArray){
  var argumentsArray = JSON.parse(argArray);

  var table = argumentsArray[0];
  var dominoes1 = argumentsArray[1];
  var dominoes2 = argumentsArray[2];

  this.scene.players['player1'].setPieces(dominoes1);
  this.scene.players['player2'].setPieces(dominoes2);
}
