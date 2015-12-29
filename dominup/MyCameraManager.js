/**
 * MyCameraManager
 * @constructor
 * @param scene
 */
function MyCameraManager(scene){
  this.scene = scene;
  this.delay = 0;
  this.delaySet = false;
  this.staticCamera = true;
  this.currentPosition = 'start';
  this.desiredPosition = 'start';

  this.cameraPositions = ['player1 view', 'player2 view', 'board view'];
  this.cameraPosition = this.cameraPositions[0];

  this.cameraMatrix = mat4.create();
  mat4.identity(this.cameraMatrix);

  this.cameraAnimation = undefined;
  this.animationSeq = [];
}

/**
 * changePosition
 * @param newPosition
 * @param delay
 */
MyCameraManager.prototype.changePosition = function(newPosition, delay){

    if(this.animationSeq.length>0) {
      console.log('change from ' + this.currentPosition + ' to ' + newPosition + 'ignored');
      return;
    }

    if(delay){
      if(newPosition!=undefined){
        this.desiredPosition = newPosition;
        this.delay=delay;
        this.delaySet = true;
        console.log('new delay' + delay);
      }
      return;
    }else this.delaySet = false;

    this.animationSeq = [];

    if(newPosition=='360 view') {
      this.animationSeq.push(new CircularAnimation(8, [0,0,0], 0, 0, -2*Math.PI));
      this.animationSeq[0].activate();
      return;
    }else if(newPosition!=undefined)
      this.desiredPosition = newPosition;

    if(this.currentPosition!=this.desiredPosition){

      console.log('cameraPositionChanged to ' + this.desiredPosition);
      console.log('from ' + this.currentPosition);

      switch (this.desiredPosition) {
        case 'start':
          console.log('start');
          mat4.identity(this.cameraMatrix);
          this.currentPosition = 'start';
          return;
        case 'player1 view':
        case 'player2 view':
          if(this.currentPosition=='board view') {

          //  this.animationSeq.push(new CircularAnimation(1, [0,0,0], 0, 0, Math.PI/4, 'zz'));

            // if necessary to change position
//            if(this.boardSide != this.desiredPosition)
  //            this.animationSeq.push(new CircularAnimation(2, [0,0,0], 0, 0, -Math.PI));

          }else if(this.currentPosition=='start') {
            console.log('PPPPPPPPPPPPPPPPPPP');
            this.boardSide = this.desiredPosition;
            this.animationSeq.push(new CircularAnimation(2, [0,0,0], 0, 0,-Math.PI/4));
          }else{
            console.log('change side');
            this.boardSide = this.desiredPosition;
            this.animationSeq.push(new CircularAnimation(2, [0,0,0], 0, 0, -Math.PI));
          }
          break;
        case 'board view':
        //  this.animationSeq.push(new CircularAnimation(1, [0,0,0], 0, 0, -Math.PI/4, 'zz'));
          break;
      }

      if(this.animationSeq.length>0)
        this.animationSeq[0].activate();
      this.currentPosition = this.desiredPosition;

      console.log('status' + this.currentPosition);
      console.log('status desiredPosition' + this.desiredPosition);
    }
};

/**
 * update
 * @param currTime
 * @return true if animations are active, false otherwise
 */
MyCameraManager.prototype.update = function(currTime){
  if(this.delaySet){
    this.delay -= currTime - this.previousTime;
    if(this.delay<=0){
      console.log('changed with delay');
      this.delaySet=false;
      this.changePosition();
    }
  }
  this.previousTime = currTime;

  if(this.animationSeq.length>0){
    if(this.animationSeq[0].isActive())
      this.animationSeq[0].update(currTime);
    else{
      mat4.mul(this.cameraMatrix, this.cameraMatrix, this.animationSeq[0].getCurrentTransformation());
      this.animationSeq.shift();

      if(this.animationSeq.length>0)
        this.animationSeq[0].activate();
      else return false;
    }
    return true;
  }else return false;
};

/**
 * getCurrentTransformation
 * @return currentMatrix
 */
MyCameraManager.prototype.getCurrentTransformation = function(){
  var currentMatrix = mat4.create();
  mat4.identity(currentMatrix);

  mat4.mul(currentMatrix, currentMatrix, this.cameraMatrix);

  if(this.animationSeq.length>0)
    mat4.mul(currentMatrix, currentMatrix, this.animationSeq[0].getCurrentTransformation());

  return currentMatrix;
};
