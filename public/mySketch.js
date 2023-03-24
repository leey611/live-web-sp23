let capture, cacheGraphic, drawingGrpahic

function preload() {
  capture = createCapture(VIDEO);
}

function setup() {
	createCanvas(640*1.5, 480*1.5);
	capture.size(width,height)
	capture.hide()
	
	cacheGraphic = createGraphics(width,height)
	cacheGraphic.translate(width,0)
	cacheGraphic.scale(-1,1)
	
	drawingGraphic = createGraphics(width,height)
	drawingGraphic.noStroke()
	
	background(100);
}

function draw() {
	capture.loadPixels()
	if (capture.pixels[0]) {
		cacheGraphic.image(capture,0,0,width,height)
		//if (mouseIsPressed) {
		let pixel = cacheGraphic.get(mouseX,mouseY)
		let r = pixel[0]
		let g = pixel[1]
		let b = pixel[2]
		let a = pixel[3]
		drawingGraphic.fill(r,g,b,a)
		drawingGraphic.circle(mouseX,mouseY,100)
		//}
	
		image(cacheGraphic,0,0,width,height)
		image(drawingGraphic,0,0,width,height)
	}
	
}

function mousePressed() {
	drawingGraphic.clear()
}

function keyTyped() {
	if (key === 's' || key === 'S') {
    saveCanvas('myCanvas', 'png');
  }
  return false;
}