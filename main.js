const server = require("./apps/server");

server.listen(8080, () => {
  console.log("server running at http://localhost:8080");
});
