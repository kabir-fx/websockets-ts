import { WebSocketServer } from "ws";

const websocketServer = new WebSocketServer({ port: 8000 });

websocketServer.on("connection", (socket) => {
  socket.send("Helooo from server!");
  console.log("Client connected!");

  socket.on("message", (e) => {
    if (e.toString() === "ping") {
      socket.send("pong");
    }
  });
})

