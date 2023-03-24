
var socket = io.connect();
let sendChatBtn = document.getElementById('sendChatBtn')
let usernameValue
const chatBox = document.getElementById('messages')

socket.on('connect', function () {

    console.log("Connected" + socket.id);

});

// user name themselves
socket.on('named', function (data) {
    console.log("got your name " + data)
    //usernameValue = document.getElementById('username').value
    let welcomeMessage = document.createElement('div')
    welcomeMessage.innerText = `Welcome ${data}!`
    chatBox.appendChild(welcomeMessage)
})

// Receive from any event
socket.on('chatmessage', function (data) {
    console.log('got chat data ' + data + ' end')
    //console.log(data);
    const { username, chat } = data
    let newChatMessage = document.createElement('div')
    newChatMessage.innerText = `${username}: ${chat}`
    chatBox.appendChild(newChatMessage)

});



document.getElementById('nameForm').addEventListener('submit', function (event) {
    event.preventDefault()
    usernameValue = document.getElementById('username').value
    socket.emit('named', usernameValue)
})

document.getElementById('messageForm').addEventListener('submit', function (event) {
    event.preventDefault()
    messageValue = document.getElementById('message').value
    const userID = socket.id
    const chat = messageValue
    socket.emit('chatmessage', chat)

})


