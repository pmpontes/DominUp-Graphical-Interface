/*
 * MySpaceEnvironment
 * @constructor
 * @param scene
 */
 function MySpaceEnvironment(scene) {
 	CGFobject.call(this,scene);
 };

 MySpaceEnvironment.prototype = Object.create(CGFobject.prototype);

 MySpaceEnvironment.prototype.constructor = MySpaceEnvironment;

 MySpaceEnvironment.prototype.display = function(){

 };