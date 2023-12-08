const WebSocket = require("ws");
const http = require("http");
const {
  tokens,
  validateToken,
  decodeToStr,
  closeUnusedSocket,
  getTime,
} = require("../helpers/helper");
let iotSocket;
let frontendSocket;

const httpHandler = (req, res) => {
  const method = req.method;
  const url = req.url;
  if (method === "GET") {
    if (url === "/auto") {
      if (iotSocket && iotSocket.readyState === WebSocket.OPEN)
        iotSocket.send("auto");
      res.end("OK");
    } else if (url === "/manual") {
      if (iotSocket && iotSocket.readyState === WebSocket.OPEN)
        iotSocket.send("manual");
      res.end("OK");
    } else if (url === "/on") {
      if (iotSocket && iotSocket.readyState === WebSocket.OPEN)
        iotSocket.send("on");
      res.end("OK");
    } else if (url === "/off") {
      if (iotSocket && iotSocket.readyState === WebSocket.OPEN)
        iotSocket.send("off");
      res.end("OK");
    }
  }
};

const app = http.createServer(httpHandler);

const wss = new WebSocket.Server({ server: app });

const wssHandler = (socket, req) => {
  const authToken = req.headers.authorization ?? null;
  if (authToken) {
    const token = decodeToStr(req.headers.authorization).split(":")[1];
    if (validateToken(token, tokens.get("deviceToken"))) {
      iotSocket = null;
      closeUnusedSocket(wss.clients, socket, tokens.get("deviceToken"));
      socket.id = token;
      socket.on("message", (data) => {
        if (data == "alive") {
          frontendSocket && frontendSocket.send("online");
        }
        if (data != "alive") {
          console.log(`${getTime()}::[IoT]message: ${data}`);
        }
      });
      iotSocket = socket;
    } else {
      wss.clients.delete(socket);
    }
  } else {
    socket.id = tokens.get("frontendToken");
    socket.on("message", (data) => {
      console.log(`${getTime()}::[frontend]message: ${data}`);
    });
    socket.onclose = () => {
      console.log(`${getTime()}::[frontend]info: offline`);
    };
    frontendSocket = socket;
  }

  if (frontendSocket && iotSocket) {
    iotSocket.onmessage = ({ data }) => {
      data != "alive" && frontendSocket.send(data);
    };
  }
  console.log(
    `${getTime()}::[server]info: new connection has been established to ${
      req.socket.remoteAddress
    }`
  );
  console.log(
    `${getTime()}::[server]info: connected clients: ${wss.clients.size}`
  );
};

wss.on("connection", wssHandler);

app.listen(80, "0.0.0.0", () =>
  console.log(`${getTime()}::[server]info: server running`)
);

/** this line do the same thing, handling message event
 * socket.addEventListener("message", ({ data }) => console.log(data.toString()))
 * socket.addListener("message", ({ data }) => console.log(data.toString()))
 * socket.onmessage = ({ data }) => console.log(data.toString())
 * socket.on("message", (data) => console.log(data.toString()))
 */
