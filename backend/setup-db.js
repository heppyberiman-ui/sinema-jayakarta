const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function setupDatabase() {
  let connection;
  try {
    // Baca SQL file
    const sqlFile = path.join(__dirname, "database.sql");
    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    // Filter out comments
    const cleanedSql = sqlContent
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    // Koneksi ke MySQL (tanpa database dulu)
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
    });

    console.log("✅ Berhasil connect ke MySQL");

    // Split SQL statements by semicolon
    const statements = cleanedSql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    // Execute setiap statement
    for (const statement of statements) {
      try {
        // Gunakan query tanpa prepared statement untuk DDL
        await connection.query(statement);
        const preview = statement.substring(0, 60).replace(/\n/g, " ");
        console.log(`✅ ${preview}...`);
      } catch (error) {
        if (!error.message.includes("already exists")) {
          console.warn(`⚠️ ${error.message}`);
        }
      }
    }

    console.log("\n🎉 Database setup BERHASIL!");
    console.log("✅ Database 'sinema_jayakarta' siap digunakan");
    console.log("✅ Table 'movie' dengan kolom: judul, genre, tahun, image");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
