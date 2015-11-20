/*
 * MyForestEnvironment
 * @constructor
 * @param scene
 */
 function MyForestEnvironment(scene) {
 	CGFobject.call(this,scene);
 };

 MyForestEnvironment.prototype = Object.create(CGFobject.prototype);

 MyForestEnvironment.prototype.constructor = MyForestEnvironment;

 MyForestEnvironment.prototype.display = function(){

 };