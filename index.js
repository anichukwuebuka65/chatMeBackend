const { WebSocketServer } = require("ws");
const Rooms = require("./classes/Rooms");

const { rooms, joinRoom, createRoom } = new Rooms();
const room = new Rooms();
const PORT = process.env.PORT || 3000;
const wsServer = new WebSocketServer({ port: PORT });

wsServer.on("connection", handleConnection);

function handleConnection(ws) {
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    if (message.type === "joinRoom") {
      if (!message.roomId) return;
      ws.roomId = message.roomId;
      joinRoom(message.roomId, ws);
      if (rooms[ws.roomId].length === 2) {
        rooms[ws.roomId][0].send(JSON.stringify({ type: "userJoined" }));
      }
      return;
    }
    if (message.type === "createRoom") {
      const roomId = createRoom(ws);
      ws.send(JSON.stringify({ type: "roomJoined", roomId }));
    }
    rooms[ws.roomId]?.forEach((client) => {
      if (client !== ws) {
        client.send(JSON.stringify(JSON.parse(data.toString())));
      }
    });
  });
  ws.on("close", () => {
    closeConnection(ws);
  });
}

function closeConnection(ws) {
  let room = rooms[ws.roomId];
  if (room) {
    room = room.filter((client) => {
      return client !== ws;
    });
  }
}
