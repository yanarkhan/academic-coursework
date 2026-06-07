# Skenario dan Test Case Blackbox

## 1. Tujuan Pengujian

Pengujian blackbox dilakukan untuk memastikan fitur utama aplikasi berjalan sesuai kebutuhan pengguna tanpa melihat detail implementasi internal kode.

Fokus pengujian:

1. Login valid dan invalid.
2. Input nilai dengan rentang 0 sampai 100.
3. Hak akses route berdasarkan middleware.
4. Perhitungan nilai akhir dan status kelulusan.
5. Fungsi utama Admin, Guru, dan Siswa.

## 2. Lingkup Pengujian

| Area | Fitur yang Diuji |
| --- | --- |
| Autentikasi | Login, logout, redirect role |
| Otorisasi | Proteksi route Admin, Guru, Siswa |
| Input Nilai | Validasi rentang nilai, kalkulasi, status |
| Admin | CRUD siswa, CRUD guru, lihat nilai |
| Guru | Input nilai, rekap nilai, edit nilai |
| Siswa | Lihat nilai pribadi |

## 3. Test Case Blackbox

| ID | Skenario | Data Uji | Langkah Pengujian | Hasil yang Diharapkan | Status |
| --- | --- | --- | --- | --- | --- |
| TC-01 | Login Admin valid | username: `admin`, password: `admin123` | Buka `/login`, isi kredensial, klik Masuk | Sistem login dan redirect ke `/admin` | Valid |
| TC-02 | Login Guru valid | username: `guru_matematika`, password: `guru123` | Buka `/login`, isi kredensial, klik Masuk | Sistem login dan redirect ke `/guru` | Valid |
| TC-03 | Login Siswa valid | username: `siswa_001`, password: `siswa123` | Buka `/login`, isi kredensial, klik Masuk | Sistem login dan redirect ke `/siswa` | Valid |
| TC-04 | Login invalid | username salah atau password salah | Buka `/login`, isi data salah, klik Masuk | Sistem menampilkan pesan gagal login dan tetap di halaman login | Valid |
| TC-05 | Logout | Pengguna sudah login | Klik tombol Keluar di navbar | Session terhapus dan pengguna diarahkan ke login | Valid |
| TC-06 | Admin tambah siswa valid | NIS unik, nama, kelas, username unik, password | Login Admin, buka Data Siswa, tambah siswa | Siswa tersimpan dan muncul pada tabel | Valid |
| TC-07 | Admin tambah siswa dengan NIS duplikat | NIS sudah ada | Submit form tambah siswa | Sistem menampilkan pesan bahwa data sudah terdaftar | Valid |
| TC-08 | Admin tambah guru valid | ID Guru unik, nama, mapel, username unik, password | Login Admin, buka Data Guru, tambah guru | Guru tersimpan dan muncul pada tabel | Valid |
| TC-09 | Admin tambah guru dengan ID duplikat | ID Guru sudah ada | Submit form tambah guru | Sistem menampilkan pesan bahwa data sudah terdaftar | Valid |
| TC-10 | Guru input nilai valid batas bawah | Tugas 0, UTS 0, UAS 0 | Login Guru, input nilai siswa | Data ditolak/diterima sesuai validasi rentang, nilai akhir 0, status TIDAK_LULUS jika tersimpan | Valid |
| TC-11 | Guru input nilai valid batas atas | Tugas 100, UTS 100, UAS 100 | Login Guru, input nilai siswa | Nilai akhir 100 dan status LULUS | Valid |
| TC-12 | Guru input nilai tengah valid | Tugas 80, UTS 75, UAS 85 | Login Guru, input nilai siswa | Nilai akhir dihitung otomatis dan status sesuai nilai akhir | Valid |
| TC-13 | Guru input nilai kurang dari 0 | Tugas -1, UTS 80, UAS 80 | Submit form input nilai | Sistem menolak data dan menampilkan pesan validasi | Valid |
| TC-14 | Guru input nilai lebih dari 100 | Tugas 101, UTS 80, UAS 80 | Submit form input nilai | Sistem menolak data dan menampilkan pesan validasi | Valid |
| TC-15 | Guru input nilai duplikat siswa-mapel | Siswa dan guru yang sama sudah punya nilai | Submit nilai kedua kali | Sistem menolak karena unique constraint siswaId dan guruId | Valid |
| TC-16 | Guru edit nilai valid | Nilai Tugas/UTS/UAS baru dalam rentang 0-100 | Klik edit pada tabel rekap nilai | Nilai akhir dan status dihitung ulang | Valid |
| TC-17 | Admin akses halaman Admin | Session role ADMIN | Buka `/admin` | Halaman Admin tampil | Valid |
| TC-18 | Guru mencoba akses Admin | Session role GURU | Buka `/admin` | Sistem menolak dan redirect ke login/dashboard sesuai proteksi | Valid |
| TC-19 | Siswa mencoba akses Guru | Session role SISWA | Buka `/guru` | Sistem menolak dan redirect ke login/dashboard sesuai proteksi | Valid |
| TC-20 | Pengguna belum login akses dashboard | Tidak ada session | Buka `/admin`, `/guru`, atau `/siswa` | Sistem redirect ke `/login` | Valid |
| TC-21 | Siswa melihat nilai pribadi | Login role SISWA | Buka `/siswa/nilai-saya` | Sistem menampilkan hanya nilai milik siswa tersebut | Valid |
| TC-22 | Admin melihat laporan lengkap | Login role ADMIN | Buka `/admin/laporan` | Sistem menampilkan laporan nilai lengkap | Valid |

## 4. Kriteria Keberhasilan

Pengujian dinyatakan berhasil apabila:

1. Login hanya berhasil untuk kredensial valid.
2. Role pengguna diarahkan ke dashboard yang benar.
3. Route terlindungi tidak bisa diakses oleh role yang salah.
4. Input nilai hanya menerima angka 0 sampai 100.
5. Nilai akhir dan status kelulusan sesuai formula.
6. Data yang ditampilkan sesuai hak akses pengguna.

