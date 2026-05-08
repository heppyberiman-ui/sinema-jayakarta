"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-lg"
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1030,
      }}
    >
      <div className="container-fluid">
        <Link
          href="/"
          className="navbar-brand fw-bold d-flex align-items-center"
          style={{
            fontSize: "1.5rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            background: "linear-gradient(45deg, #fff 0%, #f8f9fa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <span className="me-2">🎬</span>
          Sinema Jakarta
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "8px",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center w-100">
            <li className="nav-item">
              <Link
                href="/"
                className="nav-link px-3 py-2 mx-1"
                style={{
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                }}
              >
                🏠 Beranda
              </Link>
            </li>
            <li className="nav-item flex-grow-1 mx-3">
              <form onSubmit={handleSearch} className="d-flex">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Cari film..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      color: "white",
                      borderRadius: "25px 0 0 25px",
                      padding: "8px 15px",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <button
                    className="btn"
                    type="submit"
                    style={{
                      background:
                        "linear-gradient(45deg, #3498db 0%, #2980b9 100%)",
                      border: "none",
                      color: "white",
                      borderRadius: "0 25px 25px 0",
                      padding: "8px 15px",
                      boxShadow: "0 2px 10px rgba(52, 152, 219, 0.3)",
                      fontWeight: "bold",
                    }}
                  >
                    Cari
                  </button>
                </div>
              </form>
            </li>
            <li className="nav-item">
              <Link
                href="/films/new"
                className="nav-link btn text-white ms-2 px-4 py-2"
                style={{
                  background:
                    "linear-gradient(45deg, #3498db 0%, #2980b9 100%)",
                  border: "none",
                  borderRadius: "25px",
                  boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
              >
                ➕ Tambah Film
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
