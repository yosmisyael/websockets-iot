const mysql = require("mysql");
const util = require("util");

class Database {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 1,
      host: "127.0.0.1",
      port: 3306,
      user: "user",
      password: "user",
      database: "arduino_websockets_iot",
    });

    this.query = util.promisify(this.pool.query).bind(this.pool);
  }

  getQuery() {
    return this.query;
  }
}

module.exports = new Database();
