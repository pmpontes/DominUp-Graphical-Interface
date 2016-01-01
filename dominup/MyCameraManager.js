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
  this.zoom=0;
}

/**
 * zoomIn
 */
MyCameraManager.prototype.zoomIn = function(){
  if(this.animationSeq==undefined)
    this.animationSeq=[];

  if(this.zoom<3){
    this.zoom++;
    this.animationSeq.push(new LinearAnimation(0.5, [[0, 0, 0], [0, 1, 0]]));

    if(this.animationSeq.length==1)
      this.animationSeq[0].activate();
  }
};

/**
 * zoomOut
 */
MyCameraManager.prototype.zoomOut = function(){
  if(this.animationSeq==undefined)
    this.animationSeq=[];

  if(this.zoom>-3){
    this.zoom--;
    this.animationSeq.push(new LinearAnimation(0.5, [[0, 0, 0], [0, -1, 0]]));

    if(this.animationSeq.length==1)
      this.animationSeq[0].activate();
  }
};


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
      console.log(this.animationSeq);

      switch (this.desiredPosition) {
        case 'start':
          console.log('start');
          mat4.identity(this.cameraMatrix);
          this.currentPosition = 'start';
          return;
        case 'player1 view':
        case 'player2 view':
          if(this.currentPosition=='board view') {

            //this.animationSeq.push(new CircularAnimation(1, [0,0,0], 0, 0, Math.PI/4, 'zz', true));
            if(this.boardSide=='player1 view')
              this.animationSeq.push(new CircularAnimation(1, [0,0,0], 0, 0, Math.PI/5, 'zz', true));
            else if(this.boardSide=='player2 view')
              this.animationSeq.push(new CircularAnimation(1, [0,0,0], 0, 0, -Math.PI/5, 'zz'));

            // if necessary to change position
            if(this.boardSide != this.desiredPosition){
              console.log('change side');
              this.boardSide = this.desiredPosition;
              this.animationSeq.push(new CircularAnimation(2, [0,0,0], 0, 0, -Math.PI));
            }

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
          if(this.boardSide=='player1 view')
            this.animationSeq.push(new CircularAnimation(1, [0,0,0], 0, 0, -Math.PI/5, 'zz'));
          else if(this.boardSide=='player2 view')
            this.animationSeq.push(new CircularAnimation(1, [0,0,0], 0, 0, Math.PI/5, 'zz', true));
          break;
      }

      if(this.animationSeq.length>0){
        this.animationSeq[0].activate();
        console.log(this.animationSeq[0]);
      }
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
console.log(this.animationSeq);
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
