// library
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

//instance
const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

// End point
app.get("/", (req, res) => {
  res.json("Api is working");
});

// socket
io.on("connect", (socket) => {
  console.log("Connected");

  //get user and room
  socket.on("join", ({ username, room }, callback) => {
    console.log("username:", username, "room:", room);
    // console.log(socket.id);
    const { response, error } = addUsers({
      id: socket.id,
      username: username,
      room: room,
    });

    if (error) {
      callback(error);
      return;
    }

    // join in the room
    socket.join(response.room);
    socket.emit("message", {
      username: "admin",
      text: `Welcome ${response.username} `,
    });

    socket.broadcast.to(response.room).emit("message", {
      username: "admin",
      text: `${response.username} has joined`,
    });

    io.to(response.room).emit("roomMembers", getRoomUsers(response.room));
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", {
      username: user.username,
      text: message,
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log("Disconnect");
  });
});

// handle users
let users = [];

const addUsers = ({ id, username, room }) => {
  console.log("details", id, username, room);
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // check username and room is empty
  if (!username || !room) {
    return { error: "Name and Room are required." };
  }

  // check username and room already exists
  if (users.length) {
    const data = users.find((e) => e.username === username && e.room === room);
    console.log("data", data);
    if (data) {
      return { error: "user already exist" };
    }
  }
  const response = { id, username, room };

  users.push(response);

  return { response };
};

const getUser = (id) => {
  return users.find((e) => e.id == id);
};

const removeUser = (id) => {
  const findIdx = users.findIndex((user) => user.id == id);

  if (findIdx >= 0) {
    return users.splice(findIdx, 1)[0];
  }
};

const getRoomUsers = (room) => {
  return users.filter((e) => e.room === room);
};

server.listen(5000, () => console.log("Server Started....."));
