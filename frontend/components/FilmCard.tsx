"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { API_BASE_URL, Film } from "@/lib/api";

const getImageUrl = (image: string | null | undefined) => {
  if (!image) return null;
  return image.startsWith("http://") || image.startsWith("https://")
    ? image
    : `${API_BASE_URL}/uploads/${image}`;
};

export default function FilmCard({
  film,
  onDelete,
  isDeleting,
}: {
  film: Film;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(film.image);

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onDelete || !film.id_film) return;
    onDelete(film.id_film);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div
        className="card h-100 shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "15px",
          transition: "all 0.3s ease",
          cursor: "pointer",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
        }}
      >
        <div
          style={{
            height: "280px",
            overflow: "hidden",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {imageUrl && !imageError ? (
            <>
              <img
                src={imageUrl}
                alt={film.judul}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                }}
                onError={handleImageError}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {film.genre || "Film"}
              </div>
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "16px",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎬</div>
              <div style={{ fontWeight: "bold" }}>{film.judul}</div>
              <div style={{ fontSize: "12px", marginTop: "5px", opacity: 0.7 }}>
                {film.genre || "Genre tidak tersedia"}
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
          <h5
            className="card-title text-white fw-bold mb-2"
            style={{
              fontSize: "1.1rem",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {film.judul}
          </h5>
          <div className="mb-3">
            <span
              className="badge me-2"
              style={{
                background: "linear-gradient(45deg, #3498db 0%, #2980b9 100%)",
                color: "white",
                fontSize: "0.75rem",
              }}
            >
              {film.genre || "Tidak diketahui"}
            </span>
            <span
              className="badge"
              style={{
                background: "linear-gradient(45deg, #e74c3c 0%, #c0392b 100%)",
                color: "white",
                fontSize: "0.75rem",
              }}
            >
              {film.tahun || "N/A"}
            </span>
          </div>

          <p
            className="text-white-50 mb-3"
            style={{
              minHeight: "3.2rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              whiteSpace: "normal",
            }}
          >
            {film.sinopsis ? film.sinopsis : "Sinopsis belum tersedia."}
          </p>

          <div className="d-flex gap-2 mt-3 flex-wrap">
            <Link
              href={`/films/${film.id_film}/edit`}
              className="btn btn-warning btn-sm flex-fill"
              style={{
                background: "linear-gradient(45deg, #f39c12 0%, #e67e22 100%)",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              ✏️ Edit
            </Link>
            <Link
              href={`/films/${film.id_film}`}
              className="btn btn-primary btn-sm flex-fill"
              style={{
                background: "linear-gradient(45deg, #3498db 0%, #2980b9 100%)",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              👁️ Lihat
            </Link>
            <button
              type="button"
              className="btn btn-danger btn-sm flex-fill"
              style={{
                background: "linear-gradient(45deg, #e74c3c 0%, #c0392b 100%)",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "🗑️ Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
