const mysql = require("mysql2/promise");

async function test() {
  try {
    console.log("🔍 Mencoba koneksi ke MySQL...");
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
    });

    console.log("✅ Koneksi berhasil!");

    // Coba buat database
    await connection.query("CREATE DATABASE IF NOT EXISTS sinema_jayakarta");
    console.log("✅ Database sinema_jayakarta dibuat/sudah ada");

    // Ganti ke database
    await connection.query("USE sinema_jayakarta");

    // Buat tabel
    await connection.query(`
      CREATE TABLE IF NOT EXISTS movie (
        id_film INT PRIMARY KEY AUTO_INCREMENT,
        judul VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        tahun INT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabel movie dibuat");

    // Insert sample data
    await connection.query(
      "INSERT INTO movie (judul, genre, tahun) VALUES (?, ?, ?)",
      ["Test Film", "Action", 2024],
    );
    console.log("✅ Sample data inserted");

    await connection.end();
    console.log("\n🎉 Database setup BERHASIL!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

test();
