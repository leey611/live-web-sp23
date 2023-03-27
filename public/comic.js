let socket = io.connect();

socket.on('connectComic', function() {
    socket.emit('enterComic', {})
	console.log("enter comic " + socket.id);
});
// socket.on('connect', function() {
//     socket.emit('enterComic', {})
// 	console.log("connect in comic " + socket.id);
// });
socket.on('connect', function() {
    socket.emit('enterGame', {})
	console.log("enter comicgame " + socket.id);
});

socket.on('enterComic', function(data) {
    console.log('bothRole ', data)
})

function setup() {
    
}

function draw() {
    console.log('hi')
    //socket.emit('enterComic', {})
}

function mousePressed() {
    socket.emit('enterComic', {})
}