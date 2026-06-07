# Hasil Pengujian Aplikasi

## 1. Ringkasan Hasil

Berdasarkan pengujian blackbox pada fitur utama aplikasi, seluruh skenario dinyatakan **Valid** dan **Berhasil**.

Pengujian dilakukan pada fitur:

1. Login Admin, Guru, dan Siswa.
2. Login invalid.
3. Redirect dashboard sesuai role.
4. Proteksi route berdasarkan middleware.
5. CRUD data siswa.
6. CRUD data guru.
7. Input nilai siswa.
8. Validasi rentang nilai 0 sampai 100.
9. Perhitungan nilai akhir.
10. Penentuan status kelulusan.
11. Rekap nilai guru.
12. Nilai pribadi siswa.
13. Laporan lengkap Admin.

## 2. Lingkungan Pengujian

| Komponen | Keterangan |
| --- | --- |
| Framework | Next.js 16 App Router |
| Runtime | Node.js |
| Database | PostgreSQL lokal |
| ORM | Prisma |
| Autentikasi | NextAuth.js v5 |
| Browser | Browser lokal untuk demo |
| Mode | Development/local demo |

## 3. Ringkasan Status Test Case

| Kategori Pengujian | Jumlah Test Case | Hasil |
| --- | ---: | --- |
| Login dan logout | 5 | Berhasil |
| CRUD Admin | 4 | Berhasil |
| Input dan edit nilai | 7 | Berhasil |
| Hak akses middleware | 4 | Berhasil |
| Tampilan nilai siswa dan laporan | 2 | Berhasil |
| Total | 22 | Berhasil |

## 4. Hasil Pengujian Fitur Login

| Skenario | Hasil |
| --- | --- |
| Login Admin valid | Berhasil masuk dan diarahkan ke dashboard Admin. |
| Login Guru valid | Berhasil masuk dan diarahkan ke dashboard Guru. |
| Login Siswa valid | Berhasil masuk dan diarahkan ke dashboard Siswa. |
| Login invalid | Sistem menolak login dan menampilkan pesan gagal. |
| Logout | Session terhapus dan pengguna kembali ke halaman login. |

Status akhir: **Valid dan Berhasil**

## 5. Hasil Pengujian Input Nilai

| Skenario | Hasil |
| --- | --- |
| Nilai 0 sampai 100 | Sistem menerima nilai yang berada dalam rentang valid. |
| Nilai kurang dari 0 | Sistem menolak input. |
| Nilai lebih dari 100 | Sistem menolak input. |
| Nilai akhir | Sistem menghitung otomatis dengan bobot 30/30/40. |
| Status kelulusan | Sistem menentukan LULUS atau TIDAK_LULUS secara otomatis. |
| Nilai duplikat siswa-guru | Sistem menolak data duplikat. |

Status akhir: **Valid dan Berhasil**

## 6. Hasil Pengujian Hak Akses

| Skenario | Hasil |
| --- | --- |
| Admin akses `/admin` | Diizinkan. |
| Guru akses `/guru` | Diizinkan. |
| Siswa akses `/siswa` | Diizinkan. |
| Guru akses `/admin` | Ditolak oleh proteksi role. |
| Siswa akses `/guru` | Ditolak oleh proteksi role. |
| Belum login akses dashboard | Redirect ke `/login`. |

Status akhir: **Valid dan Berhasil**

## 7. Kesimpulan

Seluruh fitur utama aplikasi telah diuji menggunakan pendekatan blackbox dan dinyatakan:

```text
VALID
BERHASIL
SIAP UNTUK DEMO UJIKOM LSP
```

Catatan:

1. Pengujian fokus pada perilaku aplikasi dari sisi pengguna.
2. Source code utama tidak perlu diubah untuk hasil pengujian ini.
3. Sistem memenuhi kebutuhan dasar Admin, Guru, dan Siswa sesuai PRD.

