console.log('SCRIPT WORKING')
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
var audio_element = document.querySelectorAll("audio");
console.log(audio_element);
const socket = io('http://localhost:3000')
const name = prompt('What is your name?')
socket.emit('new-user', roomid, name);

function handleplaysound(id){
  for(var i=0;i<audio_element.length;i++){
    if(audio_element[i].paused!==true){
      audio_element[i].paused===true;
      var ret = audio_element[i].id.replace('audio','');
      handlepausesound(ret);
    }
  }
    socket.emit('clientEvent', {
      msg:'Sent an event from the client by play button!',
      id:id
    });
};

function handlepausesound(id){
  socket.emit('clientEventPause', {
    msg:'Sent an event from the client by pause button!',
    id:id
  });
};

socket.on('playonall',data =>{
    const id= data.id;
    var btn = document.getElementById(id);
    var x = document.getElementById(id+"-audio");
    x.currentTime=0;
    x.play();
});
socket.on('pauseonall',data =>{
    const id= data.id;
    var btn = document.getElementById(id);
    var x = document.getElementById(id+"audio");
    x.currentTime=0;
    x.pause();
})
socket.on('message', message => {
  outputMessage(message);
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//chat message submit
// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
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