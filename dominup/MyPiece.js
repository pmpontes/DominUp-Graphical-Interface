/**
 * Created by Gil on 19/11/2015.
 */

function MyPiece(scene, valueL, valueR) {
    CGFobject.call(this,scene);

    this.valueL = valueL;
    this.valueR = valueR;
    this.id = -1;

    this.animation = null;
    this.initialPosition = mat4.create();
		mat4.identity(this.initialPosition);
    //this.currentMatrix = initialPosition;

    this.rectangle = new MyRectangle(this.scene, [0, 1, 1 ,0]);
};

MyPiece.prototype.setId = function(newId) {
    this.id=newId;
};

MyPiece.prototype.getId = function() {
    return this.id;
};

MyPiece.prototype.selected = function() {
    this.animation = new LinearAnimation(4, [[0,0,0], [0,0.5,0]]);
    this.animation.activate();
};

MyPiece.prototype.unselected = function() {
    this.animation = new LinearAnimation(4, [[0,0.5, 0], [0,0,0]]);
    this.animation.activate();
};

MyPiece.prototype.setSelectable = function() {
    this.scene.registerForPick(this.id, this);
};

MyPiece.prototype.getValues = function() {
    return [this.valueL, this.valueR];
};

MyPiece.prototype.display = function() {
  this.scene.pushMatrix();

  if(this.animation!=undefined)
    this.scene.multMatrix(this.animation.getCurrentTransformation());

  this.scene.multMatrix(this.initialPosition);
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

MyPiece.prototype.setInitialPosition = function(side, x, z){
    this.side = side;
    var matrx = mat4.create();
    mat4.identity(matrx);
    if(this.side == 'player2')
      mat4.rotateY(matrx, matrx, Math.PI);
    var vectr = vec3.fromValues(x, z, 0.25);
    mat4.translate(matrx, matrx, vectr);
    this.initialPosition = matrx;
};

MyPiece.prototype.update = function(curTime){
  if(this.animation!=undefined)
    this.animation.update();
};

MyPiece.prototype.createAnimation = function(time, center, radius, angStart, angRot){
  this.animation = new CircularAnimation(time, center, radius, angStart, angRot);
}
