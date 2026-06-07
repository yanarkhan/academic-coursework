# Flowchart dan Alur Kerja

Dokumen ini menjelaskan alur kerja utama sistem menggunakan diagram Mermaid agar dapat langsung dirender oleh Markdown viewer yang mendukung Mermaid.

## 1. Flowchart Login dan Redirect Role

```mermaid
flowchart TD
    A([Mulai]) --> B[Buka halaman Login]
    B --> C[Input username dan password]
    C --> D{Kredensial valid?}
    D -- Tidak --> E[Tampilkan pesan login gagal]
    E --> B
    D -- Ya --> F[Ambil role pengguna dari session JWT]
    F --> G{Role pengguna}
    G -- ADMIN --> H[Redirect ke /admin]
    G -- GURU --> I[Redirect ke /guru]
    G -- SISWA --> J[Redirect ke /siswa]
    H --> K([Dashboard sesuai role])
    I --> K
    J --> K
```

Penjelasan:

1. Pengguna membuka halaman `/login`.
2. Pengguna mengisi username dan password.
3. Sistem memvalidasi kredensial menggunakan NextAuth.js Credentials Provider.
4. Jika tidak valid, sistem menampilkan pesan gagal.
5. Jika valid, sistem membaca role dari session/JWT.
6. Sistem mengarahkan pengguna ke dashboard sesuai role.

## 2. Flowchart Proteksi Route Middleware

```mermaid
flowchart TD
    A([Request halaman]) --> B{Ada session?}
    B -- Tidak --> C{Route public?}
    C -- Ya --> D[Lanjutkan request]
    C -- Tidak --> E[Redirect ke /login]
    B -- Ya --> F[Ambil role dari JWT]
    F --> G{Route sesuai role?}
    G -- Ya --> D
    G -- Tidak --> E
    D --> H([Halaman tampil])
```

Penjelasan:

Middleware menjaga route `/admin`, `/guru`, dan `/siswa`. Pengguna tanpa session diarahkan ke `/login`. Pengguna dengan role yang tidak sesuai juga diarahkan kembali ke halaman login.

## 3. Flowchart Input Nilai Hingga Status Kelulusan

```mermaid
flowchart TD
    A([Guru login]) --> B[Buka halaman Input Nilai]
    B --> C[Pilih siswa dari dropdown]
    C --> D[Input nilai Tugas, UTS, dan UAS]
    D --> E{Semua nilai 0 sampai 100?}
    E -- Tidak --> F[Tampilkan pesan validasi gagal]
    F --> D
    E -- Ya --> G[Server Action inputNilaiAction]
    G --> H[Validasi data dengan Zod]
    H --> I{Validasi berhasil?}
    I -- Tidak --> J[Kembalikan pesan data tidak valid]
    I -- Ya --> K[Instansiasi NilaiService]
    K --> L[Hitung nilai akhir]
    L --> M[Tentukan status kelulusan]
    M --> N[Simpan data nilai ke PostgreSQL melalui Prisma]
    N --> O[Revalidasi halaman rekap dan laporan]
    O --> P[Tampilkan pesan berhasil]
    P --> Q([Selesai])
```

Formula yang digunakan:

```text
Nilai Akhir = (0.3 x Tugas) + (0.3 x UTS) + (0.4 x UAS)
```

Aturan kelulusan:

```text
Nilai Akhir >= 70  => LULUS
Nilai Akhir < 70   => TIDAK_LULUS
```

## 4. Alur Kerja Berdasarkan Aktor

### 4.1 Admin

```mermaid
flowchart LR
    A[Login Admin] --> B[Dashboard Admin]
    B --> C[Kelola Siswa]
    B --> D[Kelola Guru]
    B --> E[Lihat Data Nilai]
    B --> F[Lihat Laporan]
```

### 4.2 Guru

```mermaid
flowchart LR
    A[Login Guru] --> B[Dashboard Guru]
    B --> C[Input Nilai]
    C --> D[Preview Nilai Akhir]
    D --> E[Simpan Nilai]
    B --> F[Rekap Nilai]
```

### 4.3 Siswa

```mermaid
flowchart LR
    A[Login Siswa] --> B[Dashboard Siswa]
    B --> C[Nilai Saya]
    C --> D[Lihat Nilai Akhir]
    C --> E[Lihat Status Kelulusan]
```

## 5. Catatan Desain Alur

1. Semua operasi database dilakukan melalui Prisma.
2. Semua operasi CRUD dari form melewati Server Action.
3. Server Action memanggil class service agar bukti OOP terlihat jelas.
4. Formula nilai menggunakan fungsi/method yang terpusat agar tidak terjadi duplikasi logika.

