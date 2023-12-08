const getTime = () => {
  return new Date(Date.now()).toLocaleTimeString();
};

const tokens = new Map([
  ["deviceToken", "6a4abeb7-6905-4025-8a87-74657ee8a7aa"],
  ["frontendToken", "b47acb9f-fe6f-4d1b-9fa5-2063b1af64cf"],
]);

const validateToken = (requestToken, validToken) => {
  return requestToken === validToken ? true : false;
};

const decodeToStr = (encoded) => {
  return Buffer.from(encoded.replace("Basic ", ""), "base64").toString("utf-8");
};

// const authenticate = (info, callback) => {
//   const encodedAuth = info.req.headers.authorization ?? null;
//   if (encodedAuth) {
//     const [key, value] = decodeToStr(encodedAuth).split(":");
//     if (key === "id" && validateId(value, ids.deviceId)) {
//       if (wss) {
//         console.log(wss.clients);
//         callback(true);
//       }
//     } else {
//       callback(false, 401, "Unauthorized");
//     }
//   } else {
//     callback(false, 401, "Unauthorized");
//   }
// };

// const getSocketbyId = (wssClients, id) => {
//   let findSocket;
//   wssClients.forEach((socket) => {
//     if (socket.id === id) {
//       findSocket = socket;
//       return findSocket;
//     } else {
//       return null;
//     }
//   });
// };

const closeUnusedSocket = (wssClients, newSocket, id) => {
  let staleConnection;
  wssClients.forEach((socket) => {
    if (socket.id === id) {
      staleConnection = socket;
    }
  });
  if (staleConnection && staleConnection !== newSocket) {
    console.log("stale connection found and will be deleted");
    wssClients.delete(staleConnection);
  }
};

module.exports = {
  tokens,
  validateToken,
  getTime,
  decodeToStr,
  closeUnusedSocket,
};
