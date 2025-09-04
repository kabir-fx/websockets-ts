import WebSocket, { WebSocketServer } from "ws";

interface User {
  socket: WebSocket,
  room: string
}

const websocketServer = new WebSocketServer({ port: 8000 });

let globalArr: User[] = [];

websocketServer.on("connection", (socket) => {
  socket.send("Helooo from WebSocket!");
    socket.on("message", (msg) => {
      // @ts-ignore
      const parsedMsg = JSON.parse(msg);
      /*
        Request to Join a Room:
          {
             "type": "join",
             "payload": {
               "roomId": "123"
             }
          }
      */
      if (parsedMsg.type == "join") {
        globalArr.push({
          socket: socket,
          room: parsedMsg.payload.roomId
        })

        socket.send("Connected to Room: " + parsedMsg.payload.roomId);
      } else {
        /*
        Send a message in a Room:
        {
          "type": "chat",
          "payload": {
            "message: "hi there"
          }
        }
        */
        const currentUserRoom = globalArr.find((x) => x.socket == socket)?.room;

        if (!currentUserRoom) {
          socket.send("Not part of room, join one!")
        } else {
          for (let index = 0; index < globalArr.length; index++) {
            if (globalArr[index]?.room == currentUserRoom) {
              globalArr[index]?.socket.send(parsedMsg.payload.message)
            }
          }
        }
      }
    });
})

