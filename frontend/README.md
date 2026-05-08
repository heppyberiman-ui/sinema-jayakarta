# Sinema Jakarta - Film Management Website

Website manajemen film yang dibuat dengan Next.js, React, dan Bootstrap. Aplikasi ini memungkinkan pengguna untuk melihat daftar film, melihat detail film, menambah film baru, mengedit film, dan menghapus film.

## Fitur Utama

- 🎬 **Daftar Film**: Tampilkan semua film dalam layout grid yang responsif
- 📖 **Detail Film**: Lihat informasi lengkap film termasuk sinopsis
- ➕ **Tambah Film**: Tambahkan film baru ke database
- ✏️ **Edit Film**: Ubah informasi film yang sudah ada
- 🗑️ **Hapus Film**: Hapus film dari database
- 📱 **Responsif**: Desain yang responsif dengan Bootstrap 5
- 🎨 **UI Modern**: Antarmuka yang menarik dan user-friendly

## Teknologi yang Digunakan

- **Frontend**: Next.js 15, React 19, TypeScript
- **CSS Framework**: Bootstrap 5
- **HTTP Client**: Axios
- **Database Integration**: API Local (localhost:5000)

## Persyaratan

- Node.js 16+ atau lebih baru
- npm atau yarn package manager
- API server berjalan di `http://localhost:5000`

## Instalasi

1. Clone atau extract project ini:

```bash
cd sinemajayakarta
```

2. Install dependencies:

```bash
npm install
```

3. Pastikan API server berjalan di localhost:5000

4. Jalankan development server:

```bash
npm run dev
```

5. Buka browser dan akses: `http://localhost:3000`

## Struktur Project

```
sinemajayakarta/
├── app/
│   ├── layout.tsx           # Layout utama dengan Navbar dan Footer
│   ├── page.tsx             # Halaman beranda (daftar film)
│   └── films/
│       ├── new/page.tsx     # Halaman tambah film baru
│       └── [id]/
│           ├── page.tsx     # Halaman detail film
│           └── edit/page.tsx # Halaman edit film
├── components/
│   ├── Navbar.tsx           # Komponen navigasi
│   ├── FilmCard.tsx         # Komponen kartu film
│   └── FilmForm.tsx         # Komponen form film
├── lib/
│   └── api.ts               # Service untuk API calls
├── public/                  # Folder untuk static assets
├── package.json             # Dependencies project
├── tsconfig.json            # Konfigurasi TypeScript
├── next.config.js           # Konfigurasi Next.js
└── .eslintrc.json           # Konfigurasi ESLint
```

## API Endpoints

Aplikasi ini mengintegrasikan dengan API local yang harus menyediakan endpoint berikut:

- `GET /films` - Ambil semua film
- `GET /films/:id` - Ambil detail film berdasarkan ID
- `POST /films` - Buat film baru
- `PUT /films/:id` - Update film
- `DELETE /films/:id` - Hapus film

### Format Data Film

```json
{
  "id": 1,
  "name": "Nama Film",
  "description": "Deskripsi singkat",
  "genre": "Genre film",
  "director": "Nama sutradara",
  "synopsis": "Sinopsis lengkap",
  "duration": 120,
  "releaseDate": "2024-04-22",
  "rating": 8.5,
  "posterUrl": "https://..."
}
```

## Perintah Dasar

```bash
# Development server
npm run dev

# Build untuk production
npm run build

# Jalankan production server
npm start

# Jalankan linter
npm run lint
```

## Fitur-Fitur Detail

### Halaman Beranda (/)

- Menampilkan grid daftar film
- Setiap kartu menampilkan gambar poster, judul, genre, dan deskripsi singkat
- Tombol "Lihat Detail" untuk melihat informasi lengkap
- Tombol "+ Tambah Film" di navbar untuk menambah film baru
- Loading indicator saat mengambil data
- Error message jika API tidak tersedia

### Halaman Detail Film (/films/[id])

- Menampilkan informasi lengkap film
- Poster film (jika ada)
- Rating bintang
- Informasi: Sutradara, Tanggal Rilis, Durasi
- Deskripsi dan Sinopsis lengkap
- Tombol Edit untuk mengubah informasi
- Tombol Hapus untuk menghapus film dengan konfirmasi

### Halaman Tambah Film (/films/new)

- Form untuk menambahkan film baru
- Input fields: Nama, Genre, Sutradara, Durasi, Rating, Tanggal Rilis, Deskripsi, Sinopsis, URL Poster
- Validasi form (Nama wajib diisi)
- Loading state saat submit
- Redirect ke halaman beranda setelah berhasil

### Halaman Edit Film (/films/[id]/edit)

- Sama seperti form tambah, tapi dengan data film yang sudah ada
- Pre-filled form fields dengan data dari API
- Submit mengupdate film yang ada
- Redirect ke halaman detail setelah berhasil

## Responsivitas

Aplikasi ini menggunakan Bootstrap 5 dan dirancang untuk responsif di semua ukuran layar:

- Mobile (< 576px)
- Tablet (576px - 992px)
- Desktop (> 992px)

Grid film akan menyesuaikan jumlah kolom berdasarkan ukuran layar.

## Troubleshooting

### Error: "Gagal mengambil data film. Pastikan API server berjalan"

- Pastikan API server sudah berjalan di `http://localhost:5000`
- Cek koneksi network Anda
- Lihat console browser untuk detail error

### Tombol tidak merespon

- Pastikan JavaScript diaktifkan di browser
- Hard refresh page dengan Ctrl+Shift+R

### Styling tidak bekerja

- Pastikan Bootstrap CSS sudah ter-load dengan benar
- Cek console untuk CSS loading errors

## Pengembangan Lebih Lanjut

Fitur yang dapat ditambahkan di masa depan:

- Search dan filtering film
- Pagination untuk daftar film
- User authentication dan authorization
- Rating dan review dari user
- Wishlist atau favorit film
- Upload gambar poster
- Dark mode toggle

## Lisensi

Project ini bebas digunakan untuk keperluan pribadi dan komersial.

## Kontak & Support

Untuk pertanyaan atau masalah, silakan hubungi tim development.
