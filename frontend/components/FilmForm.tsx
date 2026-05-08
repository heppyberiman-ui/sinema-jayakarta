"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, Film } from "@/lib/api";

interface FilmFormProps {
  film?: Film;
  isEdit?: boolean;
}

export default function FilmForm({ film, isEdit = false }: FilmFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    judul: "",
    genre: "",
    tahun: "",
    imageUrl: "",
    sinopsis: "",
  });

  const [initialImageUrl, setInitialImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when editing
  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return "";
    return image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `${API_BASE_URL}/uploads/${image}`;
  };

  useEffect(() => {
    if (isEdit && film) {
      const currentImageUrl = getImageUrl(film.image);
      setFormData({
        judul: film.judul || "",
        genre: film.genre || "",
        tahun: film.tahun?.toString() || "",
        imageUrl: currentImageUrl,
        sinopsis: film.sinopsis || "",
      });
      setInitialImageUrl(currentImageUrl);
    }
  }, [film, isEdit]);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    // Validasi frontend
    const missingFields = [];
    if (!formData.judul.trim()) missingFields.push("Judul Film");
    if (!formData.genre.trim()) missingFields.push("Genre");
    if (!formData.tahun.trim()) missingFields.push("Tahun Rilis");
    if (!formData.sinopsis.trim()) missingFields.push("Sinopsis Film");

    if (missingFields.length > 0) {
      setError(`⚠️ Lengkapi field berikut: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("judul", formData.judul.trim());
      data.append("genre", formData.genre.trim());
      data.append("tahun", formData.tahun.trim());
      data.append("sinopsis", formData.sinopsis.trim());

      if (file) {
        data.append("image", file);
      } else if (
        formData.imageUrl.trim() &&
        formData.imageUrl.trim() !== initialImageUrl
      ) {
        data.append("imageUrl", formData.imageUrl.trim());
      }

      const url =
        isEdit && film?.id_film
          ? `${API_BASE_URL}/api/movies/${film.id_film}`
          : `${API_BASE_URL}/api/movies`;

      const method = isEdit ? "PUT" : "POST";

      console.log("Request:", { method, url, formData, hasFile: !!file });

      const response = await fetch(url, {
        method,
        body: data,
      });

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (response.ok) {
        router.push("/");
      } else {
        let errorMsg = `Error ${response.status}: Gagal menyimpan film`;
        try {
          const errorData = JSON.parse(responseText);
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (e) {
          errorMsg = responseText || errorMsg;
        }
        setError(errorMsg);
        console.error("API Error:", errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error saving film:", error);
      setError(`Kesalahan: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          <h4 className="alert-heading">❌ Error</h4>
          <p className="mb-0">{error}</p>
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
      <div className="alert alert-info mb-4" role="alert">
        <small>
          ℹ️{" "}
          <strong>
            Field dengan tanda <span style={{ color: "#e74c3c" }}>*</span> harus
            diisi sebelum menyimpan
          </strong>
        </small>
      </div>
      <form onSubmit={handleSubmit}>
        {/* JUDUL */}
        <div className="mb-4">
          <label
            className="form-label text-white fw-bold mb-2"
            style={{ fontSize: "1.1rem" }}
          >
            🎬 Judul Film <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <input
            name="judul"
            value={formData.judul}
            placeholder="Masukkan judul film..."
            className="form-control form-control-lg"
            onChange={handleChange}
            required
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              color: "white",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* GENRE */}
        <div className="mb-4">
          <label
            className="form-label text-white fw-bold mb-2"
            style={{ fontSize: "1.1rem" }}
          >
            🎭 Genre <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <select
            name="genre"
            value={formData.genre}
            className="form-select form-select-lg"
            onChange={handleChange}
            required
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              color: "white",
              fontSize: "1rem",
            }}
          >
            <option value="" style={{ background: "#2c3e50", color: "white" }}>
              ⬇️ Pilih Genre (Wajib)
            </option>
            <option
              value="Action"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Action
            </option>
            <option
              value="Drama"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Drama
            </option>
            <option
              value="Comedy"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Comedy
            </option>
            <option
              value="Horror"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Horror
            </option>
            <option
              value="Romance"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Romance
            </option>
            <option
              value="Thriller"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Thriller
            </option>
            <option
              value="Sci-Fi"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Sci-Fi
            </option>
            <option
              value="Animation"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Animation
            </option>
            <option
              value="Documentary"
              style={{ background: "#2c3e50", color: "white" }}
            >
              Documentary
            </option>
          </select>
        </div>

        {/* TAHUN */}
        <div className="mb-4">
          <label
            className="form-label text-white fw-bold mb-2"
            style={{ fontSize: "1.1rem" }}
          >
            📅 Tahun Rilis <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <input
            name="tahun"
            value={formData.tahun}
            type="number"
            placeholder="2024"
            className="form-control form-control-lg"
            onChange={handleChange}
            required
            min="1900"
            max="2030"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              color: "white",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* SINOPSIS */}
        <div className="mb-4">
          <label
            className="form-label text-white fw-bold mb-2"
            style={{ fontSize: "1.1rem" }}
          >
            📝 Sinopsis Film <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <textarea
            name="sinopsis"
            value={formData.sinopsis}
            placeholder="Tuliskan sinopsis singkat film..."
            className="form-control form-control-lg"
            onChange={handleChange}
            required
            rows={5}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              color: "white",
              fontSize: "1rem",
            }}
          />
          <small className="form-text text-white-50 mt-1">
            📝 Ceritakan plot singkat agar pengguna tahu apa yang membuat film
            ini menarik.
          </small>
        </div>

        {/* UPLOAD GAMBAR */}
        <div className="mb-4">
          <label
            className="form-label text-white fw-bold mb-2"
            style={{ fontSize: "1.1rem" }}
          >
            📸 Upload Gambar
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control form-control-lg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              color: "white",
              fontSize: "1rem",
            }}
          />
          <small className="form-text text-white-50 mt-1">
            💡 Pilih file gambar untuk mengganti gambar saat ini (JPG, PNG, max
            5MB)
          </small>
        </div>

        {/* PREVIEW FILE BARU */}
        {file && (
          <div className="mb-4">
            <label className="form-label text-white fw-bold mb-2">
              🖼️ Preview Gambar Baru:
            </label>
            <div className="text-center">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{
                  maxWidth: "300px",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "15px",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>
        )}

        {/* GAMBAR SAAT INI (UNTUK EDIT) */}
        {isEdit && formData.imageUrl && !file && (
          <div className="mb-4">
            <label className="form-label text-white fw-bold mb-2">
              📋 Gambar Saat Ini:
            </label>
            <div className="text-center">
              <img
                src={formData.imageUrl}
                alt="Current image"
                style={{
                  maxWidth: "300px",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "15px",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* LINK GAMBAR (OPSIONAL) */}
        <div className="mb-4">
          <label
            className="form-label text-white fw-bold mb-2"
            style={{ fontSize: "1.1rem" }}
          >
            🔗 Link Gambar (Opsional)
          </label>
          <input
            name="imageUrl"
            value={formData.imageUrl}
            placeholder="https://example.com/image.jpg"
            className="form-control form-control-lg"
            onChange={handleChange}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              color: "white",
              fontSize: "1rem",
            }}
          />
          <small className="form-text text-white-50 mt-1">
            🌐 Atau masukkan URL gambar dari internet
          </small>
        </div>

        {/* PREVIEW LINK */}
        {formData.imageUrl && !file && (
          <div className="mb-4">
            <label className="form-label text-white fw-bold mb-2">
              🔍 Preview Link Gambar:
            </label>
            <div className="text-center">
              <img
                src={formData.imageUrl}
                alt="URL preview"
                style={{
                  maxWidth: "300px",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "15px",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        <div className="d-flex gap-3 mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg flex-fill"
            disabled={loading}
            style={{
              background: "linear-gradient(45deg, #3498db 0%, #2980b9 100%)",
              border: "none",
              borderRadius: "25px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Menyimpan...
              </>
            ) : isEdit ? (
              "💾 Update Film"
            ) : (
              "🎬 Tambah Film"
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-light btn-lg"
            onClick={() => router.push("/")}
            style={{
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "25px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
          >
            ❌ Batal
          </button>
        </div>
      </form>
    </div>
  );
}
