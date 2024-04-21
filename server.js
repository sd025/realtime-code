const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("build"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMap = {};
const codeMap = {};

function getAllConnectedClients(roomId) {

  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    console.log(`User ${username} joined room ${roomId}`);
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });

    const code = codeMap[roomId] || { html: '', css: '', js: '' }; 
    io.to(socket.id).emit(ACTIONS.CODE_CHANGE, code);
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, html,css, js }) => {
    codeMap[roomId] = { html, css, js };
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { html,css, js });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, html,css, js }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { html,css, js });
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
      socket.leave();
    });
    delete userSocketMap[socket.id];
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
