// We need the file system here
var fs = require('fs');
				
// Express is a node module for building HTTP servers
var express = require('express');
var app = express();
//var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// If the user just goes to the "route" / then run this function
app.get('/', function (req, res) {
  res.send('Hello World!')
  //console.log('hiiii')
  //app.use(express.static('public'));
});

app.post('/api', (req, res) => {
	const { image64 } = req.body
	

	console.log('image64=====', image64)
})

// Here is the actual HTTP server 
// In this case, HTTPS (secure) server
var https = require('https');

// Security options - key and certificate
var options = {
  key: fs.readFileSync('privkey1.pem'),
  cert: fs.readFileSync('cert1.pem')
};

// We pass in the Express object and the options object
var httpServer = https.createServer(options, app);

// Default HTTPS port
httpServer.listen(443);

// WebSocket Portion
// WebSockets work with the HTTP server
// Using Socket.io
const { Server } = require('socket.io');
const io = new Server(httpServer, {});

// Old version of Socket.io
//var io = require('socket.io').listen(httpServer);

// save user names
let users = {}
let socketCards = {}
// images for gallery
let images = []



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
		//console.log('new user get', users)

		users[socket.id] = socket
	
		console.log("We have a new client: " + socket.id);
		//socket.broadcast.emit('userConnect', {id: socket.id});
		socket.on('connect', function() {
			socket.broadcast.emit('enterGame', socketCards)
			//socket.broadcast.emit('userConnect', {id: socket.id});
		})

		// user mouse event
		socket.on('mouse', function(data) {
			io.sockets.emit('mouse', data)
		})

		// user clear canvas event
		socket.on('blink', function(data) {
            io.sockets.emit('blink', data);
        });

		// user name themselves
		socket.on('named', function(nameData) {
			users[socket.id].username = nameData
			// send it to all of the clients
			io.sockets.emit('named', nameData)
			console.log('name backend ', nameData)
		})
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('chatmessage', function(chat) {
			// console.log(data)
			const username = users[socket.id].username
			console.log("backend Received: 'chatmessage' " + chat);
			io.emit('chatmessage', {username, chat});
		});
		// user enter game
		socket.on('enterGame', function() {
			io.emit('enterGame', socketCards)
		})
		// user click on a card
		socket.on('clickCard', function(data) {
			const { cardId, content } = data
			socketCards[cardId] = content
			io.emit('clickCard', data)
		})
		// user enter gallery
		socket.on('enterGallery', function() {
			socket.emit('enterGallery', { images })
		})
		// user send image
		socket.on('sendImage', function(data) {
			images.push(data.image64)
			io.emit('sendImage', data)
		})
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);