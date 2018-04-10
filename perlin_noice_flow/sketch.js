var scl = 10;
var inc = 0.1;
var zoffinc = 0.001;
var N = 10000;

var cols, rows;
var particles = [];
var flowField = [];
var zoff = 0;

// framerate
var fr;

function Particle() {
	this.pos = createVector(random(width), random(height));
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxspeed = 4;

	this.update = function () {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);

		var prevPos = this.pos.copy();
		this.pos.add(this.vel);
		line(prevPos.x, prevPos.y, this.pos.x, this.pos.y);

		this.acc.mult(0);
	}

	this.applyForce = function (force) {
		this.acc.add(force);
	}

	this.show = function () {
		//stroke(floor(this.pos.x / width * 360), floor(this.pos.y / height * 100), 100, 0.01);
		stroke(floor(this.pos.x / width * 360), floor(this.pos.y / height * 100), 100, 0.02);
		strokeWeight(1);
		point(this.pos.x, this.pos.y);
	}

	this.edges = function () {
		if (this.pos.x > width) this.pos.x = 0;
		if (this.pos.x < 0) this.pos.x = width;
		if (this.pos.y > height) this.pos.y = 0;
		if (this.pos.y < 0) this.pos.y = height;
	}

	this.follow = function (vectors) {
		var x = floor(this.pos.x / scl);
		var y = floor(this.pos.y / scl);
		this.applyForce(vectors[x + y * cols]);
	}
}

function setup() {
	createCanvas(1280, 720);
	background(255);
	colorMode(HSB);
	cols = floor(width / scl);
	rows = floor(height / scl);
	fr = createP();

	flowField = new Array(rows * cols);

	for (var i = 0; i < N; i++) {
		particles[i] = new Particle();
	}
}

function draw() {
	var yoff = 0;
	for (var y = 0; y < rows; y++) {
		var xoff = 0;
		for (var x = 0; x < cols; x++) {
			var index = x + y * cols;
			var r = noise(xoff, yoff, zoff) * TWO_PI;
			var v = p5.Vector.fromAngle(r);

			flowField[index] = v;
			xoff += inc;
		}
		yoff += inc;
	}
	zoff += zoffinc;

	for (var i = 0; i < N; i++) {
		particles[i].follow(flowField);
		particles[i].update();
		particles[i].edges();
		particles[i].show();
	}

	fr.html(floor(frameRate()));
}

function keyPressed() {
	if (keyCode === 83) {
		saveCanvas("perlin_noice_flow_fr" + frameCount + "+scl" + scl + "+inc" + inc + "+zoffinc" + zoffinc + "+N" + N, "png");
	}
}