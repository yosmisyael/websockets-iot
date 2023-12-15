const { httpServer } = require("./http");
const { Server } = require("socket.io");
const socketAuthMiddleware = require("../middlewares/socket-auth-middleware");

const wss = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

wss.use(socketAuthMiddleware);

wss.on("connection", () => {
  console.log(`connected clients: ${wss.sockets.sockets.size}`);
});

module.exports = httpServer;
