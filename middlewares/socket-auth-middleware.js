const sesionRepository = require("../repository/session-repository");

module.exports = async (socket, next) => {
  const { token } = socket.handshake.auth;
  if (!token) next();

  const isTokenValid = await sesionRepository.current(token);

  if (!isTokenValid) {
    next();
  } else {
    socket.on("message", (data) => {
      console.log(data);
    });
    next();
  }
};
