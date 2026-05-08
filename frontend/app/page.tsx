"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { deleteFilm, getFilms, Film } from "@/lib/api";
import FilmCard from "@/components/FilmCard";

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [films, setFilms] = useState<Film[]>([]);
  const [filteredFilms, setFilteredFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus film ini?")) return;

    setDeletingId(id);
    const success = await deleteFilm(id);
    setDeletingId(null);

    if (!success) {
      setError("Gagal menghapus film. Silakan coba lagi.");
      return;
    }

    setFilms((prevFilms) => prevFilms.filter((film) => film.id_film !== id));
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true);
        const data = await getFilms();
        console.log("Data film dari API:", data); // Debug log
        setFilms(data);
      } catch (err) {
        setError(
          "Gagal mengambil data film. Pastikan API server berjalan di localhost:5000",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  // Filter films based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFilms(films);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    console.log("Search query:", query); // Debug log
    console.log("Films untuk disearch:", films); // Debug log
    
    const filtered = films.filter((film) => {
      // Normalize and clean string for comparison
      const normalizeString = (str: string | undefined | null) => {
        if (!str) return "";
        return str
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
      };

      const judul = normalizeString(film.judul);
      const genre = normalizeString(film.genre);
      const sinopsis = normalizeString(film.sinopsis);
      const normalizedQuery = query
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const match =
        judul.includes(normalizedQuery) ||
        genre.includes(normalizedQuery) ||
        sinopsis.includes(normalizedQuery);
      console.log(`Film "${film.judul}" match: ${match}`, { judul, genre, normalizedQuery }); // Debug log
      return match;
    });
    
    console.log("Filtered results:", filtered); // Debug log
    setFilteredFilms(filtered);
  }, [searchQuery, films]);

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section
        className="hero-section py-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1
                className="display-4 fw-bold text-white mb-3"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  background: "linear-gradient(45deg, #fff 0%, #f8f9fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                🎬 Sinema Jakarta
              </h1>
              <p
                className="lead text-white-50 mb-4"
                style={{
                  fontSize: "1.25rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                Temukan dan jelajahi koleksi film terlengkap dari Sinema
                Jakarta. Dari film klasik hingga karya terbaru, semua ada di
                sini.
              </p>
              <div className="d-flex gap-3">
                <a
                  href="/films/new"
                  className="btn btn-primary btn-lg px-4 py-2"
                  style={{
                    background:
                      "linear-gradient(45deg, #3498db 0%, #2980b9 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  ➕ Tambah Film Baru
                </a>
                <button
                  className="btn btn-outline-light btn-lg px-4 py-2"
                  style={{
                    border: "2px solid rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  📚 Jelajahi Koleksi
                </button>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  background:
                    "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span style={{ fontSize: "4rem" }}>🎥</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div
        className="container-fluid py-5"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px 20px 0 0",
          marginTop: "-20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container">
          <div className="mb-5 text-center">
            <h2 className="h1 fw-bold text-white mb-3">Koleksi Film</h2>
            {searchQuery && (
              <div className="mb-3">
                <p className="text-white-50">
                  Hasil pencarian untuk:{" "}
                  <strong className="text-white">"{searchQuery}"</strong>
                </p>
              </div>
            )}
            <p className="text-white-50 lead">
              {filteredFilms.length} dari {films.length} film tersedia dalam
              koleksi kami
            </p>
          </div>

          {error && (
            <div
              className="alert alert-warning alert-dismissible fade show mx-auto"
              style={{ maxWidth: "600px" }}
              role="alert"
            >
              <strong>⚠️ Perhatian!</strong> {error}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
              ></button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-white">Memuat koleksi film...</p>
            </div>
          ) : filteredFilms.length === 0 ? (
            <div
              className="alert alert-info text-center py-5 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              {searchQuery ? (
                <>
                  <h4>🔍 Film tidak ditemukan</h4>
                  <p>
                    Tidak ada film yang cocok dengan pencarian "{searchQuery}"
                  </p>
                  <a href="/" className="btn btn-primary mt-3">
                    Lihat Semua Film
                  </a>
                </>
              ) : (
                <>
                  <h4>🎬 Belum ada film</h4>
                  <p>Mulai tambahkan film baru untuk memulai koleksi Anda</p>
                  <a href="/films/new" className="btn btn-primary mt-3">
                    Tambah Film Pertama
                  </a>
                </>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {filteredFilms.map((film) => (
                <FilmCard
                  key={film.id_film}
                  film={film}
                  onDelete={handleDelete}
                  isDeleting={deletingId === film.id_film}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
