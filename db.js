const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  port: "3307",
  user: "root",
  password: "Pratik@123",
  database: "product_category_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

module.exports = db;
