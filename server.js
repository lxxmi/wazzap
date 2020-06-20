// server.js
const express = require("express");
const app = express();

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

var io = require("socket.io")(listener);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var rooms = {};

app.get("/", function(req, res) {
  console.log("Root Page, All rooms:"+rooms);
  res.render('main', { rooms: rooms })
});

app.get("/room", function(req, res) {
  res.render("room");
});

app.get("/:room", function(req, res){
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render("room", {roomName: req.params.room});
});

app.post("/room", function(req, res){
  if(rooms[req.body.room] != null){
    return res.redirect("/");
  }
  rooms[req.body.room] = {users:{}};
  res.redirect(req.body.room);
});


io.on("connection", socket => {
  socket.on("setUsername", data => {
    socket.join(data.roomName);
    rooms[data.roomName].users[socket.id] = data.username;
    socket.username = data.username;
    console.log(`${socket.username} : ${socket.id} is connected!`);
    socket.to(data.roomName).broadcast.emit("userJoined", data);
  });
  socket.on("typing", msg => {
    socket.to(msg.roomName).broadcast.emit("typing", msg);
    console.log(msg);
  });

  socket.on("stoptyping", msg => {
    socket.to(msg.roomName).broadcast.emit("stoptyping", "");
  });

  socket.on("new message", msg => {
    console.log(`message received at server: ${msg}`);
    socket.to(msg.roomName).broadcast.emit("new message", msg);
    console.log(
      `message sent to client: ${msg.content} ${msg.username} ${msg.timestamp}`
    );
  });

  socket.on("disconnect", () => {
    socket.on("stoptyping", msg => {
      socket.broadcast.emit("stoptyping", msg);
    });
    console.log(`${socket.username} : ${socket.id} is disconnected!`);
    
    console.log("GET USER ROOMS FUNCT:"+getUserRooms(socket));
    socket.to(getUserRooms(socket)).broadcast.emit("userLeft", {username:socket.username});
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}

