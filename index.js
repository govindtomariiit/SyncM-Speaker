const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')
var bodyParser = require('body-parser')
const formatMessage = require('./utils/messages')
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getAllUsers
} = require('./utils/users')
const botName = 'SyncM Bot'

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// for parsing application/json
app.use(bodyParser.json())
    // for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('homepage.ejs')
})

app.get('/:roomid', (req, res) => {
    res.render('room', { roomid: req.params.roomid })
})

app.post('/createRoom', (req, res) => {
    const room = uuidv4()
    res.redirect(`/${room}`)
})

app.post('/joinRoom', (req, res) => {
    const room = req.body.roomid
    const users= getAllUsers();
    // console.log(users);
    // for(var i=0;i<users.length;i++){
    //   if(users[i].room===room){
    //     res.redirect(`/${room}`)
    //     break;
    //   }
    // }
    // res.redirect('/');
    res.redirect(`/${room}`)
})

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    const user = userJoin(socket.id, name, room);

    //joining user to room
    socket.join(room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, `Hey ${user.username}! Welcome to SyncM!`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the Room`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
  
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the Room`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

  // Runs when client disconnects
  socket.on('disconnect-btn', () => {
    
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the Room`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
    app.get(`/${user.room}/`,(req,res)=>{
      res.render('homepage.ejs');
    })
  });

  socket.on('clientEvent', function (data) {
    const user = getCurrentUser(socket.id);
    io.sockets
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has played the song`)
      );
    io.sockets.to(user.room).emit('playonall', { msg: "playing on all client", id: data.id });
  });

  socket.on('clientEventPause', function (data) {
    const user = getCurrentUser(socket.id);
    io.sockets
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has paused the song`)
      );
    io.sockets.to(user.room).emit('pauseonall', { msg: "pausing on all client", id: data.id });
  });
})

server.listen(3000,()=>{
  console.log("SERVER HAS STARTED")
});