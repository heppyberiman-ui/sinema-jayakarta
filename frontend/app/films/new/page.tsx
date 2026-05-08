"use client";

import Link from "next/link";
import FilmForm from "@/components/FilmForm";

export default function NewFilmPage() {
  return (
    <div className="min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="mb-4">
              <Link
                href="/"
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
                ← Kembali ke Beranda
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
                ➕ Tambah Film Baru
              </h1>
              <p className="text-white-50 lead">
                Tambahkan film favorit Anda ke koleksi Sinema Jakarta
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
                <FilmForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
