const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const PORT = 3000;

let players = {};
let firstClick = null;

io.on("connection", (socket) => {
   console.log("A user connected:", socket.id);

   socket.on("join", (name) => {
      players[socket.id] = name;
      io.emit("playerList", Object.values(players));
   });

   socket.on("buzz", () => {
      if (!firstClick) {
         firstClick = players[socket.id];
         io.emit("buzzResult", firstClick);
      }
   });

   socket.on("reset", () => {
      firstClick = null;
      io.emit("buzzResult", null);
   });

   socket.on("disconnect", () => {
      delete players[socket.id];
      io.emit("playerList", Object.values(players));
   });
});

server.listen(PORT, '0.0.0.0', () => {
   console.log(`Server running on http://localhost:${PORT}`);
});

