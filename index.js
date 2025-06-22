const express = require('express');
const app = express();
app.use(express.static("./"));
const http = require('http');
const https = require('https');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/index.html');
});


setInterval(()=>{
    io.emit("tick");
  }, 1000)

io.on('connection', (socket) => {
  // ON PLAYER CONNECT =================================================
	console.log('a user', socket.id,  'connnected');
});



server.listen(3000, () =>{
	console.log('listening on *:3000');
});