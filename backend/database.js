const mysql = require("mysql2/promise");

// Konfigurasi koneksi database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sinema_jayakarta",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 10,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("❌ Pool error:", err.code);
});

module.exports = pool;
