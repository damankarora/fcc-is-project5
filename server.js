require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const { v4: uuid } = require('uuid');

const app = express();

const port = process.env.PORT || 3000;

const server = require('http').createServer(app)
const io = require('socket.io')(server);

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');



app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);

app.get('/getNewUserId', (req, res)=>{
  res.send(uuid());
})
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

let collectibleCordinates = [Math.random(200) + 1, Math.random(200) + 1];

io.on("connection", socket => {  
  let id = socket.handshake.query.id;
  
  io.to('gameroom').emit('updateCollectible', collectibleCordinates);
  

  socket.on('newPlayer', data=>{
    console.log("new player", data)
    io.to('gameroom').emit('addPlayer', data);
  })

  socket.on('updatePos', (data)=>{
    console.log("Someone moved!!");
    io.to('gameroom').send("SOMEONE MOVED");
    io.to('gameroom').emit('changePlayerPos', data);
  })

  socket.on('disconnect', (data)=>{
    console.log('Disconnection occured');
    io.to('gameroom').emit('removePlayer', id);
  })
})

module.exports = app; // For testing
