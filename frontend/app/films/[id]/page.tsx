"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getFilmById, deleteFilm, Film } from "@/lib/api";

export default function FilmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const filmId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchFilm = async () => {
      if (!filmId) {
        setError("ID film tidak valid");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getFilmById(parseInt(filmId));
        if (data) {
          setFilm(data);
        } else {
          setError("Film tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal mengambil data film");
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [filmId]);

  const handleDelete = async () => {
    if (!film?.id_film) return;

    if (!confirm("Apakah Anda yakin ingin menghapus film ini?")) return;

    try {
      setDeleting(true);
      const success = await deleteFilm(film.id_film);
      if (success) {
        router.push("/");
      } else {
        setError("Gagal menghapus film");
      }
    } catch (err) {
      setError("Gagal menghapus film");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Memuat detail film...</p>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || "Film tidak ditemukan"}
        </div>
        <Link href="/" className="btn btn-primary">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link
        href="/"
        className="btn btn-outline-light btn-sm mb-4"
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "25px",
          color: "white",
          transition: "all 0.3s ease",
        }}
      >
        ← Kembali ke Beranda
      </Link>

      <div className="row">
        <div className="col-md-5 mb-4">
          <div
            className="card shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "15px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {film.image ? (
                <img
                  src={
                    film.image.startsWith("http://") ||
                    film.image.startsWith("https://")
                      ? film.image
                      : `http://localhost:5000/uploads/${film.image}`
                  }
                  alt={film.judul}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML =
                        '<div style="color: rgba(255,255,255,0.8); font-size: 16px; text-align: center;"><div style="font-size: 3rem; margin-bottom: 10px;">🎬</div>Gambar tidak tersedia</div>';
                    }
                  }}
                />
              ) : (
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "16px",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <div style={{ fontSize: "4rem", marginBottom: "15px" }}>
                    🎬
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {film.judul}
                  </div>
                </div>
              )}
            </div>
            <div
              className="card-body"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div className="d-grid gap-3">
                <Link
                  href={`/films/${film.id_film}/edit`}
                  className="btn btn-primary"
                  style={{
                    background:
                      "linear-gradient(45deg, #f39c12 0%, #e67e22 100%)",
                    border: "none",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 15px rgba(243, 156, 18, 0.3)",
                  }}
                >
                  ✏️ Edit Film
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={deleting}
                  style={{
                    background:
                      "linear-gradient(45deg, #e74c3c 0%, #c0392b 100%)",
                    border: "none",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
                  }}
                >
                  {deleting ? "Menghapus..." : "🗑️ Hapus Film"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div
            className="card shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "15px",
            }}
          >
            <div
              className="card-body"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(5px)",
              }}
            >
              <h1
                className="card-title text-white mb-4"
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  background: "linear-gradient(45deg, #fff 0%, #f8f9fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {film.judul}
              </h1>

              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {film.genre && (
                    <span
                      className="badge fs-6 px-3 py-2"
                      style={{
                        background:
                          "linear-gradient(45deg, #3498db 0%, #2980b9 100%)",
                        color: "white",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      🎭 {film.genre}
                    </span>
                  )}
                  {film.tahun && (
                    <span
                      className="badge fs-6 px-3 py-2"
                      style={{
                        background:
                          "linear-gradient(45deg, #e74c3c 0%, #c0392b 100%)",
                        color: "white",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      📅 {film.tahun}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h2 className="h4 text-white fw-bold">Sinopsis</h2>
                <p className="text-white-50" style={{ whiteSpace: "pre-wrap" }}>
                  {film.sinopsis || "Sinopsis belum tersedia untuk film ini."}
                </p>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div
                    className="p-3 rounded"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <h6 className="text-white-50 mb-2">ID Film</h6>
                    <p className="text-white mb-0 fw-bold">#{film.id_film}</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div
                    className="p-3 rounded"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <h6 className="text-white-50 mb-2">Status</h6>
                    <p className="text-success mb-0 fw-bold">✅ Tersedia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
