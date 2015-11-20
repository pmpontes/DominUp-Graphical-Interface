/*
 * MyEnvironment
 * @constructor
 * @param scene
 */
 function MyEnvironment(scene) {
 	CGFobject.call(this,scene);
 };

 MyEnvironment.prototype = Object.create(CGFobject.prototype);

 MyEnvironment.prototype.constructor = MyEnvironment;

 MyEnvironment.prototype.display = function(){

 };