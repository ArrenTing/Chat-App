//This is the client side JS that will run independently on each individual client
const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

//Join chatroom
socket.emit('joinRoom', {username, room});

//Get room and users 
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on("message", (message) => {
  outputMessage(message);

  //Scroll down 
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit Event Listener
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  //Emit a chat message back to the server
  socket.emit("chatMessage", msg);
    //Clear input after submit
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Add user name to DOM
function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
