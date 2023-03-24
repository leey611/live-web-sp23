let socket = io.connect();
let x,y // for socket event
let capture, cacheGraphic, drawingGrpahic

socket.on('connect', function() {
	console.log("sketch Connected " + socket.id);
});

socket.on('mouse', function(mouseData) {
	// px = x;
	// py = y;
	x = mouseData.x;
	y = mouseData.y;
});

socket.on('blink', function(whatever) {
	drawingGraphic.clear()	
});

function preload() {
  capture = createCapture(VIDEO);
}

function setup() {
	createCanvas(640*2, 480*2);
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
		let pixel
		if (x !==undefined && y!==undefined) {
			pixel = cacheGraphic.get(x,y)
		} else {
			pixel = cacheGraphic.get(mouseX,mouseY)
		}

		//let pixel = cacheGraphic.get(mouseX,mouseY)
		let r = pixel[0]
		let g = pixel[1]
		let b = pixel[2]
		let a = pixel[3]
		drawingGraphic.fill(r,g,b,a)
		if (x !==undefined && y!==undefined) {
			drawingGraphic.circle(x,y,100)
		} else {
			drawingGraphic.circle(mouseX,mouseY,100)
		}
		//drawingGraphic.circle(mouseX,mouseY,100)
		//}
	
		image(cacheGraphic,0,0,width,height)
		image(drawingGraphic,0,0,width,height)
	}
	
}

function mouseMoved() {
	if (capture.pixels[0]) {
		//cacheGraphic.image(capture,0,0,width,height)
		//if (mouseIsPressed) {
		// let pixel = cacheGraphic.get(mouseX,mouseY)
		// let r = pixel[0]
		// let g = pixel[1]
		// let b = pixel[2]
		// let a = pixel[3]
		// drawingGraphic.fill(r,g,b,a)

		// if (x !==undefined && y!==undefined) {
		// 	drawingGraphic.circle(x,y,100)
		// } else {
		// 	drawingGraphic.circle(mouseX,mouseY,100)
		// }
		// drawingGraphic.circle(mouseX,mouseY,100)
		//}
	
		// image(cacheGraphic,0,0,width,height)
		// image(drawingGraphic,0,0,width,height)

		// send socket event
		socket.emit('mouse', { x: mouseX, y: mouseY } );
	}
}

function mousePressed() {
	//drawingGraphic.clear()
	socket.emit('blink', {});
}

// function keyTyped() {
// 	if (key === 's' || key === 'S') {
//     saveCanvas('myCanvas', 'png');
//   }
//   return false;
// }