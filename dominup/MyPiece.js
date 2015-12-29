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

  this.scene.pushMatrix();

  if(this.animation!=undefined){
    if(this.animation.type == "LINEAR")
      this.scene.multMatrix(this.animation.getCurrentTransformation());
  }

  this.scene.multMatrix(this.initialPosition);

  if(this.animation!=undefined){
    if(this.animation.type == "PIECE" || this.animation.type == "REVERSE_PIECE"){
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
      if(this.scene.pieceGeometry){
        //this.scene.setActiveShaderSimple(this.scene.pieceShader);
        //this.scene.textures[this.scene.gameLook][value].bind(0);
        //this.scene.textures['default'][value].bind(1);
      }

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

    if(value!=null && this.scene.pieceGeometry)
      this.scene.setActiveShaderSimple(this.scene.defaultShader);

    this.material.setTexture(this.scene.textures[this.scene.gameLook][0]);
    this.material.apply();
};

MyPiece.prototype.centerBottom = function(){
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(-0.5, -0.5, 0, 0);
    this.rectangle.display();
};

MyPiece.prototype.update = function(currTime){
  if(this.animation!=undefined)
    this.animation.update(currTime);
};

MyPiece.prototype.createAnimation = function(time, finalPosition){
  this.animation = new PieceAnimation(time, finalPosition, this.scene, this);
  console.log("animation created");
};

MyPiece.prototype.unplaceAnimation = function(time, finalPosition, player){
  this.animation = new ReversePieceAnimation(time, finalPosition, this.scene, this, player, this.animation.getCurrentTransformation());
  console.log("undo animation created");
};
