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
// variables for real-time canvas
let socketCards = {}
// images for gallery
let images = []

// variables for live-web-comic
let comicUsers = [] // { id, captureImg64}
let comicImages = []
const comicPrompts = [`A Man and His Cupcake
					   A man walked into a bakery and saw a delicious-looking cupcake. He bought it, but as he was walking out,
					    he accidentally dropped it on the ground.`,
					  `A Pigeon and His Opportunity
					  A nearby pigeon saw the dropped cupcake and eagerly hopped over to investigate.`,
					  `The Man and the Pigeon's Disappointment
					  The man quickly picked up the cupcake before the pigeon could grab it. The pigeon looked up at the man with sad, pleading eyes.`,
					  `The Man's Unexpected Move
					  Feeling bad for the pigeon, the man decided to give it the cupcake. The pigeon happily flew away with the cupcake in its beak, while the man was left standing there, empty-handed and confused.`]

let userNets = {}
let fishes = []

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
			console.log('sth connect')
			socket.broadcast.emit('enterGame', socketCards)
			let bothRole = comicUsers.length < 4
			socket.broadcast.emit('enterComic', { bothRole })
			//socket.broadcast.emit('userConnect', {id: socket.id});
			//socket.broadcast.emit('enterPool', { nets: userNets, fishes })
		})

		// user enterPool
		socket.on('enterPool', function(data) {
			console.log('enter pool server')
			socket.emit('enterPool', { nets: userNets, fishes })
			//io.emit('enterPool', { nets: userNets, fishes })
			//socket.broadcast.emit('newNet', )
		})
		socket.on('addFishes', function(data) {
			console.log('add fishes server', data)
			fishes = data
		})
		socket.on('updateFishes', function(data) {
			fishes = data
			io.emit('updateFishes', fishes)
		})
		socket.on('addNet', function(data) {
			console.log('addnet', data)
			userNets[data.id] = data
			socket.broadcast.emit('addNet', data)
		})
		socket.on('updateNet', function(data) {
			
			userNets[data.id].position.x = data.x
			userNets[data.id].position.y = data.y
			socket.broadcast.emit('updateNet', data)
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

		// for live-web-comic
		socket.on('enterComic', function() {
			let bothRole = comicUsers.length < 4
			console.log('bothRole ', bothRole)
			io.emit('enterComic', { bothRole, comicUsers })
			socket.emit('loadComic', { comicImages, comicPrompts })
		})
		
		socket.on('chooseRole', function(data) {
			const { role } = data
			let prompt
			// if user choose character, push to comicUsers
			if (role === 'character') {
				prompt = comicPrompts[comicUsers.length]
				comicUsers.push({ id: socket.id})
				
			}
			let bothRole = comicUsers.length < 4
			socket.emit('chooseRole', { role, comicUsers, prompt })
			io.emit('enterComic', { bothRole, comicUsers})
			// if comicUsers.length < 4, 
			// if comicUsers >= 4, users can only be viewer
		})

		socket.on('sendComic', function(data) {
			const { image64, prompt } = data
			if (comicImages.length < 4) {
				comicImages.push(data.image64)
				io.emit('sendComic', {index: comicImages.length, image64, prompt})
				if (comicImages.length === 4) {
					io.emit('storyTime', {})
				}
			} 
			
			
		})

		socket.on('captureRole', function() {

		})

		socket.on('confirmRole', function() {

		})

		socket.on('playStory', function() {

		})

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
			delete userNets[socket.id]
			socket.broadcast.emit('removeNet', { id: socket.id })
		});
	}
);