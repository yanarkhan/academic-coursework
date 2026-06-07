# EduGrade - Sistem Pengolahan Nilai Akademik

EduGrade adalah sistem informasi akademik berbasis Role-Based Access Control (RBAC) yang dikembangkan untuk kebutuhan Uji Kompetensi Keahlian (UJIKOM) LSP Programmer. Aplikasi ini membantu pengelolaan data siswa, guru, nilai, dan laporan akademik melalui antarmuka modern yang terstruktur, aman, dan mudah digunakan.

## Features

- Multi-role access untuk Admin, Guru, dan Siswa.
- Manajemen data terpusat untuk siswa, guru, mata pelajaran, dan nilai akademik.
- Kalkulasi nilai otomatis berdasarkan komponen Tugas, UTS, dan UAS.
- Penentuan status kelulusan secara otomatis berdasarkan nilai akhir.
- Cetak laporan PDF untuk kebutuhan rekap dan dokumentasi akademik.
- Autentikasi berbasis kredensial dengan kontrol akses sesuai peran pengguna.

## Persyaratan Sistem

Pastikan lingkungan lokal memenuhi kebutuhan minimum berikut sebelum menjalankan aplikasi.

- Node.js v18 atau lebih baru.
- PostgreSQL aktif dan dapat diakses dari mesin lokal.
- NPM atau Yarn sebagai package manager.
- Git untuk mengambil source code dari repositori.

## Tech Stack

| Area        | Teknologi             |
| ----------- | --------------------- |
| Framework   | Next.js App Router    |
| UI Runtime  | React                 |
| Bahasa      | TypeScript            |
| ORM         | Prisma ORM            |
| Database    | PostgreSQL            |
| Autentikasi | NextAuth.js / Auth.js |
| Styling     | Tailwind CSS          |
| Komponen UI | Shadcn UI             |

## Struktur Arsitektur

EduGrade menggunakan arsitektur Next.js App Router dengan pemisahan tanggung jawab yang jelas antara UI, server action, service layer, dan database.

Logika bisnis utama ditempatkan pada Service Layer berbasis Pemrograman Berorientasi Objek (OOP), seperti `SiswaService`, `GuruService`, dan `NilaiService`. Pendekatan ini menjaga kode tetap modular, mudah diuji, dan sesuai dengan standar kompetensi LSP.

Untuk mutasi data, aplikasi menggunakan Server Actions sehingga proses validasi, otorisasi, dan akses database tetap berjalan di sisi server. Prisma ORM digunakan sebagai satu-satunya jalur akses ke PostgreSQL melalui singleton Prisma Client.

## Getting Started

Ikuti langkah berikut untuk menjalankan proyek secara lokal.

```bash
git clone https://github.com/yanarkhan/academic-coursework.git
cd academic-coursework/semester-8-lsp-preparation/aplikasi-nilai
```

```bash
npm install
```

Salin file contoh environment menjadi `.env`.

```bash
cp .env.example .env
```

Sesuaikan nilai `DATABASE_URL`, `AUTH_SECRET`, dan konfigurasi lain di dalam `.env`.

Jalankan migrasi database dan seed data awal.

```bash
npx prisma migrate dev
npx prisma db seed
```

Jalankan server development.

```bash
npm run dev
```

Aplikasi dapat dibuka melalui:

```text
http://localhost:3000
```

## Kredensial Demo

Gunakan akun berikut untuk mencoba aplikasi setelah proses seeding database selesai.

| Role  | Username / NIS / NIP | Password   | Akses                                    |
| ----- | -------------------- | ---------- | ---------------------------------------- |
| Admin | `admin`              | `admin123` | Dashboard admin, manajemen data, laporan |
| Guru  | `1987654321`         | `guru123`  | Input nilai dan rekap nilai siswa        |
| Siswa | `1234567890`         | `siswa123` | Melihat nilai dan status kelulusan       |

> Jika data seed diubah, sesuaikan kembali kredensial demo pada tabel ini.

## Lisensi

Proyek ini dikembangkan sebagai bagian dari persiapan dan pelaksanaan UJIKOM LSP Programmer.
