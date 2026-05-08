const express = require("express");
const router = express.Router();
const db = require("../database");
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
// GET SEMUA MOVIE / CARI MOVIE
// ======================
router.get("/", async (req, res) => {
  let connection;
  const q = (req.query.q || "").trim();

  try {
    connection = await db.getConnection();

    let query = "SELECT * FROM movie ORDER BY id_film DESC";
    let values = [];

    if (q) {
      const search = `%${q}%`;
      query =
        "SELECT * FROM movie WHERE judul LIKE ? OR genre LIKE ? OR tahun LIKE ? ORDER BY id_film DESC";
      values = [search, search, search];
    }

    const [rows] = await connection.query(query, values);
    res.json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("❌ Error fetching movies:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

// ======================
// GET MOVIE BY ID
// ======================
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM movie WHERE id_film = ?",
      [req.params.id],
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({
        status: "error",
        message: "Film tidak ditemukan",
      });
    }

    res.json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ Error fetching movie:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

// ======================
// POST TAMBAH MOVIE (DENGAN UPLOAD)
// ======================
router.post("/", upload.single("image"), async (req, res) => {
  let connection;
  try {
    const { judul, genre, tahun, imageUrl, sinopsis } = req.body;

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

    connection = await db.getConnection();
    const [result] = await connection.query(
      "INSERT INTO movie (judul, genre, tahun, image, sinopsis) VALUES (?, ?, ?, ?, ?)",
      [judul, genre, tahun, image, sinopsis],
    );

    res.json({
      status: "success",
      message: "Berhasil tambah film",
      id_film: result.insertId,
      image: image,
    });
  } catch (error) {
    console.error("❌ Error adding movie:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

// ======================
// PUT UPDATE MOVIE
// ======================
router.put("/:id", upload.single("image"), async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { judul, genre, tahun, imageUrl, sinopsis } = req.body;

    if (!judul || !genre || !tahun) {
      return res.status(400).json({
        status: "error",
        message: "Judul, genre, dan tahun wajib diisi",
      });
    }

    connection = await db.getConnection();
    const [rows] = await connection.query(
      "SELECT image FROM movie WHERE id_film = ?",
      [id],
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({
        status: "error",
        message: "Film tidak ditemukan",
      });
    }

    let image = rows[0].image;

    // 🔥 Jika upload file baru
    if (req.file) {
      // Hapus file lama kalau bukan URL
      if (image && !image.startsWith("http")) {
        const oldPath = path.join(uploadsDir, image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const safeName = generateFileName(req.file.originalname);
      const filePath = path.join(uploadsDir, safeName);

      await sharp(req.file.buffer)
        .resize(500)
        .jpeg({ quality: 80 })
        .toFile(filePath);

      image = safeName;
    } else if (imageUrl) {
      // Jika pakai link
      image = imageUrl;
    }

    await connection.query(
      "UPDATE movie SET judul = ?, genre = ?, tahun = ?, image = ?, sinopsis = ? WHERE id_film = ?",
      [judul, genre, tahun, image, sinopsis, id],
    );

    res.json({
      status: "success",
      message: "Berhasil update film",
      image: image,
    });
  } catch (error) {
    console.error("❌ Error updating movie:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

// ======================
// DELETE MOVIE
// ======================
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    connection = await db.getConnection();
    const [rows] = await connection.query(
      "SELECT image FROM movie WHERE id_film = ?",
      [id],
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({
        status: "error",
        message: "Film tidak ditemukan",
      });
    }

    const image = rows[0].image;

    // Hapus file kalau bukan link
    if (image && !image.startsWith("http")) {
      const filePath = path.join(uploadsDir, image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await connection.query("DELETE FROM movie WHERE id_film = ?", [id]);

    res.json({
      status: "success",
      message: "Berhasil hapus film",
    });
  } catch (error) {
    console.error("❌ Error deleting movie:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
