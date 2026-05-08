-- =====================================================
-- DDL: Database Sinema Jayakarta
-- =====================================================

-- Membuat Database Baru
CREATE DATABASE IF NOT EXISTS sinema_jayakarta;
USE sinema_jayakarta;

-- =====================================================
-- Tabel Movie
-- =====================================================
CREATE TABLE IF NOT EXISTS movie (
  id_film INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  tahun INT,
  image VARCHAR(255),
  tahun_rilis INT,
  sutradara VARCHAR(255),
  sinopsis TEXT,
  rating DECIMAL(3,1),
  bahasa VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Index untuk Optimasi Pencarian
-- =====================================================

-- Index pada kolom judul
CREATE INDEX idx_judul ON movie(judul);

-- Index pada kolom tahun_rilis
CREATE INDEX idx_tahun_rilis ON movie(tahun_rilis);

-- Index pada kolom sutradara
CREATE INDEX idx_sutradara ON movie(sutradara);

-- Index pada kolom rating
CREATE INDEX idx_rating ON movie(rating);

-- Index pada kolom bahasa
CREATE INDEX idx_bahasa ON movie(bahasa);

-- Full-text Index untuk pencarian judul dan sinopsis (opsional, untuk pencarian yang lebih powerful)
CREATE FULLTEXT INDEX idx_fulltext_judul_sinopsis ON movie(judul, sinopsis);

-- =====================================================
-- Sample Data (Opsional)
-- =====================================================
INSERT INTO movie (judul, genre, tahun, image) VALUES
('Larangan', 'Horror', 2023, NULL),
('Pengkhianatan', 'Drama', 2022, NULL),
('The Shawshank Redemption', 'Drama', 1994, NULL),
('Avengers: Endgame', 'Action', 2019, NULL);

