# Panduan Flow Aplikasi (Untuk Presentasi Asesor LSP)

Fokus presentasi ini adalah menunjukkan implementasi **Role-Based Access Control (RBAC)** dan keamanan data.

## 1. Flow Aktor: Admin (Super User)
* **Tugas Utama:** Mengelola *master data* dan memantau keseluruhan sistem.
* **Alur:** Admin *login* -> Masuk ke **Dashboard Admin** (Melihat statistik global dan grafik tren nilai) -> Mengelola **Data Siswa & Guru** (Bisa menambah akun, mengedit, atau menghapus - CRUD penuh) -> Memantau **Data Nilai** secara global tanpa bisa mengubah isi nilai tersebut -> Mengakses **Laporan** untuk mencetak rekapitulasi sekolah.

## 2. Flow Aktor: Guru (Operator Nilai)
* **Tugas Utama:** Mengevaluasi siswa dan memberikan nilai.
* **Alur:** Guru *login* -> Masuk ke **Dashboard Guru** -> Pergi ke **Input Nilai**. Di sini Guru memilih siswa, memasukkan nilai murni (Tugas, UTS, UAS). Sistem (melalui *Class Service* / OOP) akan mengalkulasi Nilai Akhir secara otomatis -> Guru bisa melihat atau mengedit nilainya sendiri di **Rekap Nilai**. *(Catatan keamanan: Guru tidak bisa mengedit data profil Siswa, hanya nilainya saja).*

## 3. Flow Aktor: Siswa (End User / Read-Only)
* **Tugas Utama:** Melihat hasil evaluasi akademik.
* **Alur:** Siswa *login* -> Masuk ke **Dashboard Siswa** (Melihat IPK/Rata-rata di *Summary Card* besar) -> Membuka **Nilai Saya** untuk melihat detail nilai per mata pelajaran dan status kelulusannya (Lulus / Tidak Lulus).

---

# Cara Menjelaskan Halaman "Nilai Saya" kepada Asesor

Saat mempresentasikan halaman **'Nilai Saya'** di dashboard Siswa, gunakan narasi berikut untuk menyoroti aspek keamanan dan UX:

> "Ini adalah halaman **'Nilai Saya'** pada antarmuka Siswa. Halaman ini dirancang murni sebagai **Read-Only Data View** (Tampilan Data Hanya Baca). Sesuai dengan prinsip Role-Based Access Control (RBAC) pada sistem ini, Siswa sama sekali tidak memiliki otorisasi untuk menambah, mengubah, atau menghapus data nilai. 
> 
> Alur kerjanya: Begitu Guru menyimpan nilai di sisi backend, data tersebut akan langsung dirender di tabel ini secara real-time. Siswa dapat dengan jelas melihat rincian nilai Tugas, UTS, UAS, dan Nilai Akhir mereka. Untuk mempermudah User Experience (UX), saya juga mengimplementasikan visualisasi **Badge Status** (Pil Hijau untuk Lulus, Merah untuk Tidak Lulus) agar Siswa langsung mengetahui status akademiknya tanpa harus menebak-nebak standar KKM."
