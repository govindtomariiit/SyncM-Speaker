console.log('SCRIPT WORKING')
const socket = io('http://localhost:3000')
const name = prompt('What is your name?')
socket.emit('new-user', roomid, name);
const listofuser = document.getElementById('listofuser');

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  listofuser.append(messageElement)
}

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