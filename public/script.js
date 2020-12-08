console.log('SCRIPT WORKING')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io('http://localhost:3000')
const name = prompt('What is your name?')
socket.emit('new-user', roomid, name);

function handleplaysound(){
  console.log("clicked playsound");
  socket.emit('clientEvent', 'Sent an event from the client by play button!');

};

function handlepausesound(){
  console.log("clicked pausesound");
  socket.emit('clientEventPause', 'Sent an event from the client by pause button!');

};

socket.on('playonall',msg =>{
    console.log("hlo garv, wait for 2 sec");
    console.log(msg);

    var x = document.getElementById("ringtone");
    x.currentTime=0;
    x.play();
});
socket.on('pauseonall',msg =>{
    console.log("hlo garv, your song is going to paused, wait for 2 sec");
    console.log(msg);

    var x = document.getElementById("ringtone");
    x.currentTime=0;
    x.pause();
})
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }