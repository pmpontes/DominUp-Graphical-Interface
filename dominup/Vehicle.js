/**
 * Vehicle
 * @constructor
 * @param scene
 */
function Vehicle(scene) {
	CGFobject.call(this, scene);
	this.wing = new Patch(scene, 3, 20, 20, [[0, 0, -0.5], [0, -0.5, 1], [0, 0.5, 1], [0, 0, -0.5],
												[0.5, 0, -0.6], [0.5, -0.35, 0.75], [0.5, 0.35, 0.75], [0.5, 0, -0.6],
												[1.75, 0, -0.7], [1.75, -0.1, 0.125], [1.75, 0.1, 0.125], [1.75, 0, -0.7],
												[2, 0, -0.75], [2, 0, 0], [2, 0, 0], [2, 0, -0.75]]);
	this.tail = new MyCylinder(scene, [1, 0.25, 0.7, 20, 20]);
	this.cabinBack = new MyCylinder(scene, [2, 0.7, 1, 20, 20]);
	this.cabinFront = new MyCylinder(scene, [5, 1, 1.1, 20, 20]);
	this.cockpit = new MyCylinder(scene, [1, 1.1, 0.2, 20, 20]);

	this.engine = new MyCylinder(scene, [1.75, 0.4, 0.5, 20, 20]);
	this.engineCapFront = new MySphere(scene, [0.5, 20, 20]);
	this.engineCapBack = new MySphere(scene, [0.4, 20, 20]);

	this.tailTip = new MySphere(scene, [0.26, 20, 20]);
	this.cockpitTip = new MySphere(scene, [0.21, 20, 20]);
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor=Vehicle;

/**
 * display
 * Displays the vehicle on the scene.
 */
Vehicle.prototype.display = function () {

	this.scene.pushMatrix();
		this.scene.translate(0,0,-8,0);
		this.scene.scale(1, 1, 1.5);

		// Build plane cabin
		this.scene.pushMatrix();
			this.tail.display();
			this.scene.translate(0,0,0.05,0);
			this.tailTip.display();
			this.scene.translate(0,0,0.95,0);
			this.cabinBack.display();
			this.scene.translate(0,0,2,0);
			this.cabinFront.display();
			this.scene.translate(0,0,5,0);
			this.cockpit.display();
			this.scene.translate(0,0,0.95,0);
			this.cockpitTip.display();
		this.scene.popMatrix();

		// Build plane's flat surfaces
		// Cabin wings (2 pieces)
		this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 0, 0, 1);
			this.scene.translate(0.7,0,5.5,0);
			this.scene.scale(3,2.5,2.5,1);
			this.wing.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(0.7,0,5.5,0);
			this.scene.scale(3,2.5,2.5,1);
			this.wing.display();
		this.scene.popMatrix();

		// Tailplane (2 pieces)
		this.scene.pushMatrix();
			this.scene.translate(0,1.25,0,0);
			this.scene.rotate(Math.PI, 0, 0, 1);
			this.scene.translate(0,0,0.13,0);
			this.scene.scale(0.5,1,0.65,1);
			this.wing.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(0,1.25,0.13,0);
			this.scene.scale(0.5,1,0.65,1);
			this.wing.display();
		this.scene.popMatrix();

		// Rudor
		this.scene.pushMatrix();
			this.scene.translate(0, 0, 0.4, 0);
			this.scene.rotate(Math.PI/2, 0, 0, 1);
			this.scene.translate(0.1, 0, 0, 0);
			this.wing.display();
		this.scene.popMatrix();

		// Place Motors (2 pieces, 1 cylinder and 2 spheres each)
		this.scene.pushMatrix();
			this.scene.translate(3,-0.65, 4.5,0);
			this.scene.pushMatrix();
				this.scene.pushMatrix();
					this.scene.translate(0, 0, 1.75);
					this.scene.scale(1, 1, 0);
					this.engineCapFront.display();
				this.scene.popMatrix();
				this.scene.scale(1, 1, 0);
				this.engineCapBack.display();
			this.scene.popMatrix();
			this.engine.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(-3,-0.65, 4.5,0);
			this.scene.pushMatrix();
				this.scene.pushMatrix();
					this.scene.translate(0, 0, 1.75);
					this.scene.scale(1, 1, 0);
					this.engineCapFront.display();
				this.scene.popMatrix();
				this.scene.scale(1, 1, 0);
				this.engineCapBack.display();
			this.scene.popMatrix();
			this.engine.display();
		this.scene.popMatrix();

	this.scene.popMatrix();

};


/**
 * updateTextelCoordinates
 * No need to update the textel's coordinates according to amplifS and amplifT.
 *
 * @param amplifS amplification factor s
 * @param amplifT amplification factor t
 */
Vehicle.prototype.updateTexelCoordinates = function (amplifS, amplifT) {};
