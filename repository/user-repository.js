const db = require("../utils/db");
const mysql = require("mysql");

const query = db.getQuery();

const findUser = async (username) => {
  try {
    const sql = "SELECT username, password FROM users WHERE username = ?";
    const prepared = mysql.format(sql, [username]);
    const result = await query(prepared);

    if (result.length === 0) return null;

    return result[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { findUser };
