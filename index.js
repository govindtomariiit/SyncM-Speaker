const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid');
var bodyParser = require('body-parser');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = {};

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('homepage.ejs')
})

app.get('/:roomid', (req, res) => {
  console.log('IN THE ROOM NOW.')
  res.render('room', { roomid: req.params.roomid });
})

app.post('/createRoom', (req, res) => {
  const room = uuidv4();
  rooms[room] = { users: {} }
  res.redirect(`/${room}`)
})

app.post('/joinRoom', (req, res) => {
  const room = req.body.roomid;
  res.redirect(`/${room}`)
})

io.on('connection', socket => {
  console.log("connected with io")
  socket.on('new-user', (room, name) => {
    const user = userJoin(socket.id, name, room);
    socket.join(room);

    rooms[room].users[socket.id] = name;
    io.sockets.to(room).emit('user-connected', name)
    console.log(name + " join room " + room);
    console.log(rooms);
  })

  socket.on('clientEvent', function (data) {
    console.log(data);
    console.log("inside play button")
    const user = getCurrentUser(socket.id);
    console.log(user.username + " payed song")
    io.sockets.to(user.room).emit('playonall', { msg: "playing on all client" });
  });

  socket.on('clientEventPause', function (data) {
    console.log(data);
    const user = getCurrentUser(socket.id);
    io.sockets.to(user.room).emit('pauseonall', { msg: "pausing on all client" });
  });

})

server.listen(3000);