/**
 * Created by Gil on 19/11/2015.
 */

function MyPiece(scene, valueR, valueL) {
    CGFobject.call(this,scene);

    this.valueL = valueL;
    this.valueR = valueR;
    this.id = -1;

    this.animation = null;
    this.initialPosition = mat4.create();
		mat4.identity(this.initialPosition);
    this.currentMatrix = this.initialPosition;

    this.rectangle = new MyRectangle(this.scene, [0, 1, 1 ,0]);
};

MyPiece.prototype.setReferenceCoordinates = function(vectr){
  this.referenceCoordinates = vectr;
};

MyPiece.prototype.setInitialPosition = function(newPosition) {
  this.initialPosition = newPosition;
  this.currentMatrix = this.initialPosition;
};

MyPiece.prototype.setId = function(newId) {
    this.id=newId;
};

MyPiece.prototype.getId = function() {
    return this.id;
};

MyPiece.prototype.selected = function() {
    this.animation = new LinearAnimation(0.2, [[0,0,0], [0,0.5,0]]);
    this.animation.activate();
};

MyPiece.prototype.unselected = function() {
    this.animation = new LinearAnimation(0.2, [[0,0.5, 0], [0,0,0]]);
    this.animation.activate();
};

MyPiece.prototype.setSelectable = function() {
    this.scene.registerForPick(this.id, this);
};

MyPiece.prototype.getValues = function() {
    return [this.valueR, this.valueL];
};

MyPiece.prototype.display = function() {
  // TODO apply this only to top of piece
  //this.scene.setActiveShader(this.scene.pieceShader);
  //this.scene.textures[this.scene.gameLook][value].bind(0);
  //this.scene.textures[this.scene.gameLook][0].bind(1);
  //this.scene.setActiveShader(this.scene.defaultShader);

  this.scene.pushMatrix();

  if(this.animation!=undefined){
    if(this.animation.type == "LINEAR")
      this.scene.multMatrix(this.animation.getCurrentTransformation());
    if(this.animation.type == "PIECE"){
      //this.currentMatrix = mat4.clone(this.initialPosition);
      //mat4.multiply(this.currentMatrix, this.currentMatrix, this.animation.getCurrentTransformation());
      //this.scene.multMatrix(this.currentMatrix);
      //this.scene.multMatrix(this.animation.getCurrentTransformation());
    }
  }

  this.scene.multMatrix(this.initialPosition);

  if(this.animation!=undefined){
    if(this.animation.type == "PIECE"){
      //this.currentMatrix = mat4.clone(this.initialPosition);
      //mat4.multiply(this.currentMatrix, this.currentMatrix, this.animation.getCurrentTransformation());
      //this.scene.multMatrix(this.currentMatrix);
      this.scene.multMatrix(this.animation.getCurrentTransformation());
    }
  }

    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.makeHalfPiece(this.valueL);
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0, 0);
        this.makeHalfPiece(this.valueR);
    this.scene.popMatrix();

  this.scene.popMatrix();
};

MyPiece.prototype.makeHalfPiece = function (value){
    this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5, 0);
        this.centerSide();
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.centerSide();
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.centerSide();
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0, 0.25, 0, 0);
        this.centerTop(value);
    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0, -0.25, 0, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.centerBottom();
    this.scene.popMatrix();
};

MyPiece.prototype.centerSide = function(){
    this.material = this.scene.materials[this.scene.gameLook];
    this.material.setTexture(this.scene.textures[this.scene.gameLook][0]);
    this.material.apply();
    this.scene.translate(-0.5, -0.25, 0, 0);
    this.scene.scale(1, 0.5, 1);
    this.rectangle.display();
};

MyPiece.prototype.centerTop = function(value){
    if(value != null){
        this.material = this.scene.materials[this.scene.gameLook];
        this.material.setTexture(this.scene.textures[this.scene.gameLook][value]);
        this.material.apply();
    } else {
        this.material = this.scene.materials[this.scene.gameLook];
        this.material.setTexture(this.scene.textures[this.scene.gameLook][0]);
        this.material.apply();
    }
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(-0.5, -0.5, 0, 0);
    this.rectangle.display();
    this.material.setTexture(this.scene.textures[this.scene.gameLook][0]);
    this.material.apply();
};

MyPiece.prototype.centerBottom = function(value){
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(-0.5, -0.5, 0, 0);
    this.rectangle.display();
};

MyPiece.prototype.update = function(currTime){
  if(this.animation!=undefined)
    this.animation.update(currTime);
};

MyPiece.prototype.createAnimation = function(time, finalPosition){
  // finalPosition is of type {coords:[x,y,z], rotation}
  // TODO
//  this.animation = new CircularAnimation(time, center, radius, angStart, angRot);
  this.animation = new PieceAnimation(time, finalPosition, this.scene, this);

  //mat4.translate(this.currentMatrix);
}
