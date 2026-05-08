"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getFilmById, Film } from "@/lib/api";
import FilmForm from "@/components/FilmForm";

export default function EditFilmPage() {
  const params = useParams();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Memuat data film...</p>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="min-vh-100 py-5">
        <div className="container">
          <div
            className="alert alert-danger alert-dismissible fade show mx-auto"
            style={{ maxWidth: "600px" }}
            role="alert"
          >
            <strong>❌ Error!</strong> {error || "Film tidak ditemukan"}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
            ></button>
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="btn btn-primary btn-lg"
              style={{
                background: "linear-gradient(45deg, #3498db 0%, #2980b9 100%)",
                border: "none",
                borderRadius: "25px",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
              }}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="mb-4">
              <Link
                href={`/films/${film.id_film}`}
                className="btn btn-outline-light btn-sm"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "25px",
                  color: "white",
                  transition: "all 0.3s ease",
                }}
              >
                ← Kembali ke Detail
              </Link>
            </div>

            <div className="text-center mb-5">
              <h1
                className="display-5 fw-bold text-white mb-3"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  background: "linear-gradient(45deg, #fff 0%, #f8f9fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ✏️ Edit Film
              </h1>
              <p className="text-white-50 lead">
                Update informasi film "{film.judul}"
              </p>
            </div>

            <div
              className="card shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                className="card-body p-4"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(5px)",
                }}
              >
                <FilmForm film={film} isEdit={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
