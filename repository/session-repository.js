const db = require("../utils/db");
const mysql = require("mysql");

const query = db.getQuery();

const store = async (username, token) => {
  try {
    const sql = "INSERT INTO sessions (user_id, id) VALUES (?, ?)";
    const statement = mysql.format(sql, [username, token]);
    const result = await query(statement);

    if (result.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

const current = async (token) => {
  try {
    const sql = "SELECT user_id, id FROM sessions WHERE id = ?";
    const statement = mysql.format(sql, [token]);
    const result = await query(statement);

    if (result.length === 0) return null;

    return result[0];
  } catch (error) {
    throw error;
  }
};

const destroy = async (token) => {
  try {
    const sql = "DELETE FROM sessions WHERE id = ?";
    const statement = mysql.format(sql, [token]);
    const result = await query(statement);

    if (result.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { store, current, destroy };
