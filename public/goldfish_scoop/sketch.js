//7bdff2-b2f7ef-eff7f6-f7d6e0-f2b5d4
const colors = "7bdff2-b2f7ef-eff7f6-f7d6e0-f2b5d4".split("-").map(a => "#"+a)
const colors2 = "ffac81-ff928b-fec3a6-efe9ae-cdeac0".split("-").map(a => "#"+a)
let from, to
let net
let fishCount = 30
let fishes = []
let windowCenter

let socket = io.connect();
let nets = {}

socket.on('connect', function() {
    console.log('connect!!')
    socket.emit('enterPool', {})
    //console.log(net,net.id)
    net = new Net(createVector(mouseX,mouseY), "#F9E900", socket.id)
    socket.emit('addNet', net)
});
socket.on('enterPool', function(data) {
    console.log('enterpool client', data)
    // load already existed nets
    for(let i in data.nets) {
        const { position, clr, id } = data.nets[i]
        nets[i] = new Net(createVector(position.x,position.y), clr, id)
    }
    // load already exsited fishes if there are, else create new fishes
    if (data.fishes.length) {
        for (let i = 0; i < data.fishes.length; i++) {
            const f = data.fishes[i]
            const { position, velocity, sm, acceleration, maxForce, maxSpeed, from, to } = f
            console.log('exsited fish',f)
            fishes[i] = new Fish(
                createVector(position.x, position.y),
                createVector(velocity.x, velocity.y),
                sm,
                createVector(acceleration.x, acceleration.y),
                maxForce,
                maxSpeed,
                color(from.levels),
                color(to.levels)
            )
        }
        console.log('loaded fishes', fishes)
    } else {
        for(let i=0; i<fishCount; i++) {
            fishes.push(new Fish(
                            createVector(random(200,width-200), random(200, height-200)),
                            p5.Vector.random2D(),
                            random(2,4),
                            createVector(),
                            0.2,
                            5,
                            from,
                            to,
                        )
                    )
        }
        socket.emit('addFishes', fishes)
    }
})
socket.on('updateFishes', function(data) {
    for(let i = 0; i < data.length; i++) {
        const { position, velocity, acceleration, maxForce, maxSpeed } = data[i]
        fishes[i].position.x = position.x
        fishes[i].position.y = position.y
        fishes[i].velocity.x = velocity.x
        fishes[i].velocity.y = velocity.y
        fishes[i].acceleration.x = acceleration.x
        fishes[i].acceleration.y = acceleration.y
        fishes[i].maxForce = maxForce
        fishes[i].maxSpeed = maxSpeed
    }
})
socket.on('addNet', function(data) {
    console.log('new net comes', data, data.id)
    const { position, clr, id } = data
    nets[id] = new Net(createVector(position.x,position.y), clr, id)
})
socket.on('updateNet', function(data) {
    const { x, y, id } = data
    nets[id].update(createVector(x,y))
})
socket.on('removeNet', function(data) {
    delete nets[data.id]
})

function preload() {
    console.log('preload')
}

function setup() {
    console.log('setup')
	createCanvas(windowWidth, windowHeight);
	background(100);
	noFill()
	windowCenter = createVector(width/2, height/2)
	//noCursor()
	from = color(colors[0])
	to = color(colors[colors.length-1])
	
	alignSlider = 1.5//createSlider(0, 2, 1.5, 0.1);
    cohesionSlider = 0//createSlider(0, 2, 1, 0.1);
    separationSlider = 1//createSlider(0, 2, 2, 0.1);
	
    
	// for(let i=0; i<fishCount; i++) {
	//     fishes.push(new Fish(
	// 					createVector(random(200,width-200), random(200, height-200)),
	// 					from,
	// 					to,
	// 				)
	// 			)
	// }
}

function draw() {
	background("#0D1459")
	for(let i in nets) {
        nets[i].show()
    }
	net.show()
	//console.log('show fishes', fishes)
	fishes.forEach(f => {
		f.edges(windowCenter)
		f.flock(fishes, net);
        f.update();
		f.show()
	})

	fishes = fishes.filter(f => !f.isCaught)
	socket.emit('updateFishes', fishes)
}

function mouseMoved() {
    //if (mouseX <= width && mouseX >= 0 && mouseY >=0 && mouseY <= height) {
        net.update(createVector(mouseX,mouseY))
        socket.emit('updateNet', { x: mouseX, y: mouseY, id: socket.id })
    //}
    
}