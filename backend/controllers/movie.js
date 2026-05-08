const express = require("express");
const router = express.Router();
const pool = require("../database");

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// ======================
// SETUP UPLOADS FOLDER
// ======================
const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ======================
// MULTER (MEMORY)
// ======================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ======================
// GENERATE SAFE FILE NAME
// ======================
const generateFileName = (originalName) => {
  return (
    Date.now() +
    "_" +
    originalName
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9._-]/g, "")
  );
};

// ======================
// GET ALL MOVIES
// ======================
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [movies] = await connection.query(
      "SELECT * FROM movie ORDER BY id_film DESC",
    );

    connection.release();

    res.json({
      status: "success",
      data: movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// ======================
// POST MOVIE (UPLOAD IMAGE ATAU LINK)
// ======================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { judul, genre, tahun, imageUrl } = req.body;

    if (!judul || !genre || !tahun) {
      return res.status(400).json({
        status: "error",
        message: "Judul, genre, dan tahun wajib diisi",
      });
    }

    let image = null;

    // 🔥 Jika upload file
    if (req.file) {
      const safeName = generateFileName(req.file.originalname);
      const filePath = path.join(uploadsDir, safeName);

      await sharp(req.file.buffer)
        .resize(500)
        .jpeg({ quality: 80 })
        .toFile(filePath);

      image = safeName;
    }

    // 🔥 Jika pakai link
    if (!image && imageUrl) {
      image = imageUrl;
    }

    const connection = await pool.getConnection();

    await connection.query(
      "INSERT INTO movie (judul, genre, tahun, image) VALUES (?, ?, ?, ?)",
      [judul, genre, tahun, image],
    );

    connection.release();

    res.json({
      status: "success",
      message: "Berhasil tambah film",
      image: image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// ======================
// DELETE MOVIE
// ======================
router.delete("/:id_film", async (req, res) => {
  try {
    const { id_film } = req.params;

    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      "SELECT image FROM movie WHERE id_film = ?",
      [id_film],
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({
        status: "error",
        message: "Movie tidak ditemukan",
      });
    }

    const image = rows[0].image;

    // hapus file kalau bukan link
    if (image && !image.startsWith("http")) {
      const filePath = path.join(uploadsDir, image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await connection.query("DELETE FROM movie WHERE id_film = ?", [id_film]);

    connection.release();

    res.json({
      status: "success",
      message: "Movie berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
