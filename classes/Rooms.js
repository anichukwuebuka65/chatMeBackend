class Rooms {
  rooms = {};
  constructor() {
    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
  }
  createRoom(ws) {
    const id = Math.floor(Math.random() * 100);
    ws.roomId = id;
    this.rooms[id] = [ws];
    return id;
  }

  joinRoom(id, ws) {
    const roomIsFull = this.rooms[id]?.length === 2;
    if (roomIsFull) return "room is already full";
    this.rooms[id].push(ws);
    ws.send(JSON.stringify({ type: "roomJoined", roomId: id }));
  }

  closeRoom(id) {
    this.room[id].forEach((conn) => conn.destroy());
    delete this.rooms[id];
  }
}

module.exports = Rooms;
