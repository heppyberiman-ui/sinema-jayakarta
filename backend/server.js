const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const movieRoutes = require("./routes/movie");

const app = express();
const PORT = 5000;

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// FIX UPLOADS (ANTI ERROR)
// ======================
const uploadsPath = path.join(__dirname, "uploads");
const publicPath = path.join(__dirname, "public");

// 🔥 otomatis buat folder kalau belum ada
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("Folder uploads dibuat:", uploadsPath);
}

// 🔥 serve static file untuk halaman web dan gambar upload
app.use(express.static(publicPath));
app.use("/uploads", express.static(uploadsPath));

console.log("Static public aktif di:", publicPath);
console.log("Static uploads aktif di:", uploadsPath);

// ======================
// ROUTES
// ======================
app.use("/api/movies", movieRoutes);

// ======================
// ROOT API TEST
// ======================
app.get("/api", (req, res) => {
  res.json({
    message: "API Jalan 🚀",
  });
});

// ======================
// ERROR HANDLING
// ======================
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
    error: err.message,
  });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
