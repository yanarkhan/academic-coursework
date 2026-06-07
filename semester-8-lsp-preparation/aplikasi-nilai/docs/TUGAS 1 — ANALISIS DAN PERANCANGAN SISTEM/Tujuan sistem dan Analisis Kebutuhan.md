# Tujuan Sistem dan Analisis Kebutuhan

## 1. Identitas Sistem

Nama sistem: **Aplikasi Pengolahan Nilai Siswa**

Konteks penggunaan: aplikasi web lokal untuk kebutuhan UJIKOM LSP Programmer, dengan fokus pada pengolahan nilai akademik siswa, autentikasi berbasis role, implementasi OOP pada backend, dan pemrograman terstruktur pada utilitas perhitungan nilai.

Teknologi utama:

| Komponen | Teknologi |
| --- | --- |
| Framework | Next.js 16 App Router |
| Bahasa | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Autentikasi | NextAuth.js v5 Credentials Provider |
| Validasi | Zod |
| UI | Shadcn UI dan Tailwind CSS v4 |
| Hash password | bcryptjs |

## 2. Tujuan Sistem

Tujuan utama sistem adalah menyediakan aplikasi pengolahan nilai siswa yang dapat digunakan oleh Admin, Guru, dan Siswa sesuai hak akses masing-masing.

Tujuan rinci:

1. Menyediakan fitur login berbasis username dan password.
2. Membatasi akses halaman berdasarkan role pengguna: Admin, Guru, dan Siswa.
3. Memudahkan Admin mengelola data siswa dan guru.
4. Memudahkan Guru menginput, mengedit, dan melihat rekap nilai siswa yang diajarnya.
5. Memudahkan Siswa melihat nilai pribadi dan status kelulusannya.
6. Menghitung nilai akhir secara otomatis dengan formula:

```text
Nilai Akhir = (30% x Tugas) + (30% x UTS) + (40% x UAS)
```

7. Menentukan status kelulusan secara otomatis:

```text
LULUS jika Nilai Akhir >= 70
TIDAK_LULUS jika Nilai Akhir < 70
```

8. Menunjukkan bukti kompetensi LSP melalui dua pendekatan pemrograman:
   - Pemrograman Berorientasi Objek melalui class service.
   - Pemrograman Terstruktur melalui fungsi utilitas nilai.

## 3. Analisis Pengguna

### 3.1 Admin

Admin adalah pengguna dengan hak akses tertinggi. Admin bertanggung jawab atas pengelolaan data master dan pengawasan nilai secara keseluruhan.

Kebutuhan Admin:

| Kebutuhan | Penjelasan |
| --- | --- |
| Login ke sistem | Admin masuk menggunakan akun role ADMIN. |
| Mengelola data siswa | Admin dapat menambah, melihat, mengubah, dan menghapus data siswa. |
| Mengelola data guru | Admin dapat menambah, melihat, mengubah, dan menghapus data guru. |
| Melihat seluruh nilai | Admin dapat melihat nilai dari semua guru dan siswa. |
| Menghapus nilai | Admin dapat menghapus data nilai jika diperlukan. |
| Melihat laporan | Admin dapat melihat laporan lengkap nilai siswa. |

Hak akses Admin:

```text
/admin
/admin/siswa
/admin/guru
/admin/nilai
/admin/laporan
```

### 3.2 Guru

Guru adalah pengguna yang bertugas menginput dan mengelola nilai siswa untuk mata pelajaran yang diampunya.

Kebutuhan Guru:

| Kebutuhan | Penjelasan |
| --- | --- |
| Login ke sistem | Guru masuk menggunakan akun role GURU. |
| Input nilai | Guru memilih siswa dan memasukkan nilai Tugas, UTS, dan UAS. |
| Preview nilai akhir | Sistem menghitung nilai akhir dan status kelulusan secara otomatis. |
| Rekap nilai | Guru dapat melihat daftar nilai siswa yang diajarnya. |
| Edit nilai | Guru dapat memperbarui nilai miliknya sendiri. |

Hak akses Guru:

```text
/guru
/guru/input-nilai
/guru/rekap-nilai
```

### 3.3 Siswa

Siswa adalah pengguna yang hanya dapat melihat nilai miliknya sendiri.

Kebutuhan Siswa:

| Kebutuhan | Penjelasan |
| --- | --- |
| Login ke sistem | Siswa masuk menggunakan akun role SISWA. |
| Melihat ringkasan nilai | Siswa melihat rata-rata pribadi dan jumlah mata pelajaran. |
| Melihat nilai pribadi | Siswa melihat nilai per mata pelajaran. |
| Melihat status kelulusan | Siswa melihat badge Lulus atau Tidak Lulus. |

Hak akses Siswa:

```text
/siswa
/siswa/nilai-saya
```

## 4. Fungsi Utama Sistem

| Kode | Fungsi | Aktor |
| --- | --- | --- |
| F-01 | Login dan logout | Admin, Guru, Siswa |
| F-02 | Redirect dashboard sesuai role | Admin, Guru, Siswa |
| F-03 | CRUD data siswa | Admin |
| F-04 | CRUD data guru | Admin |
| F-05 | Input nilai siswa | Guru |
| F-06 | Edit nilai siswa | Guru |
| F-07 | Hapus nilai | Admin, Guru sesuai hak akses |
| F-08 | Lihat rekap nilai guru | Guru |
| F-09 | Lihat nilai pribadi | Siswa |
| F-10 | Lihat laporan lengkap | Admin |

## 5. Spesifikasi Fungsional

1. Sistem menyediakan halaman login menggunakan Credentials Provider.
2. Sistem melakukan validasi username dan password.
3. Sistem menyimpan session menggunakan strategi JWT.
4. Sistem melakukan proteksi route berdasarkan role.
5. Admin dapat mengelola data siswa dan guru.
6. Guru dapat menginput nilai dengan rentang 0 sampai 100.
7. Sistem menghitung nilai akhir otomatis saat input dan update nilai.
8. Sistem menentukan status kelulusan otomatis.
9. Siswa hanya dapat melihat nilai dirinya sendiri.
10. Semua pesan dan label antarmuka menggunakan Bahasa Indonesia.

## 6. Spesifikasi Nonfungsional

| Kategori | Kebutuhan |
| --- | --- |
| Keamanan | Password di-hash menggunakan bcryptjs. |
| Otorisasi | Middleware membatasi akses route berdasarkan role. |
| Reliabilitas | Server Action menggunakan try-catch dan pesan error informatif. |
| Maintainability | Logika bisnis ditempatkan di service layer. |
| DRY | Formula nilai tidak ditulis berulang secara inline di UI. |
| Performa | Data utama diambil melalui Server Component dan Prisma. |
| Validasi | Input form divalidasi menggunakan Zod. |
| Responsif | UI menggunakan Tailwind CSS mobile-first. |

## 7. Batasan Sistem

1. Sistem berjalan untuk kebutuhan lokal/demo UJIKOM.
2. Satu guru hanya mengampu satu mata pelajaran.
3. Satu siswa hanya boleh memiliki satu nilai per guru.
4. Sistem tidak menyediakan fitur export PDF/Excel.
5. Sistem tidak menyediakan fitur lupa password.
6. Sistem tidak menyediakan fitur reset password mandiri.
7. Data demo disediakan melalui seed database.

