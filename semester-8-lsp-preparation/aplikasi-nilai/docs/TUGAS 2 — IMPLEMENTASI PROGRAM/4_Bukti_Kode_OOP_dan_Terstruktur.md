# Bukti Kode OOP dan Terstruktur

Dokumen ini membuktikan output 8 dan 9, yaitu implementasi pemrograman terstruktur dan pemrograman berorientasi objek.

## Output 8 - Bukti Pemrograman Terstruktur

Pemrograman terstruktur dibuktikan melalui file:

```text
lib/utils/nilaiUtils.ts
```

File ini berisi fungsi-fungsi prosedural yang memiliki satu tanggung jawab jelas. Fungsi-fungsi tersebut digunakan untuk menghitung nilai akhir, menentukan status kelulusan, memvalidasi rentang nilai, memformat nilai, dan menentukan varian badge status.

Potongan kode asli:

```ts
export type StatusKelulusanNilai = "LULUS" | "TIDAK_LULUS";
export type VarianBadgeStatus = "default" | "destructive";

/** Bobot nilai tugas sesuai formula bisnis resmi. */
const BOBOT_TUGAS = 0.3;

/** Bobot nilai UTS sesuai formula bisnis resmi. */
const BOBOT_UTS = 0.3;

/** Bobot nilai UAS sesuai formula bisnis resmi. */
const BOBOT_UAS = 0.4;

/** Batas minimum nilai akhir agar siswa dinyatakan lulus. */
const BATAS_KELULUSAN = 70;
```

Potongan fungsi kalkulasi:

```ts
export function hitungNilaiAkhir(
  nilaiTugas: number,
  nilaiUTS: number,
  nilaiUAS: number
): number {
  return BOBOT_TUGAS * nilaiTugas + BOBOT_UTS * nilaiUTS + BOBOT_UAS * nilaiUAS;
}
```

Potongan fungsi status dan validasi:

```ts
export function tentukanStatusKelulusan(nilaiAkhir: number): StatusKelulusanNilai {
  return nilaiAkhir >= BATAS_KELULUSAN ? "LULUS" : "TIDAK_LULUS";
}

export function validasiRentangNilai(nilai: number): boolean {
  return Number.isFinite(nilai) && nilai >= 0 && nilai <= 100;
}
```

Potongan fungsi format dan badge:

```ts
export function formatNilai(nilai: number): string {
  return nilai.toFixed(2);
}

export function getVarianBadgeStatus(status: string): VarianBadgeStatus {
  return status === "LULUS" ? "default" : "destructive";
}
```

Penjelasan:

1. Setiap fungsi memiliki input dan output yang jelas.
2. Fungsi tidak melakukan query database.
3. Fungsi hanya fokus pada kalkulasi, validasi, format, dan tampilan status.
4. Tipe data return ditulis eksplisit.

## Output 9 - Bukti Pemrograman Berorientasi Objek

Pemrograman OOP dibuktikan melalui class service, salah satunya:

```text
lib/services/NilaiService.ts
```

Class ini memiliki property private, konstanta bisnis private readonly, constructor, method kalkulasi, method validasi, dan method CRUD.

Potongan kode asli:

```ts
import { StatusKelulusan } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
import type {
  CreateNilaiInput,
  LaporanNilai,
  NilaiDenganRelasi,
  NilaiGuru,
  NilaiSiswa,
  UpdateNilaiInput,
} from "@/types";

/**
 * NilaiService - Class utama untuk logika bisnis pengolahan nilai siswa.
 * Class ini menjadi bukti OOP dengan property private, konstanta bisnis,
 * constructor, method kalkulasi, validasi, CRUD nilai, dan laporan.
 */
export class NilaiService {
  /** Instance Prisma Client yang diambil dari singleton global. */
  private prisma: PrismaClient;

  /** Bobot nilai tugas sesuai ketentuan bisnis resmi. */
  private readonly BOBOT_TUGAS = 0.3;

  /** Bobot nilai UTS sesuai ketentuan bisnis resmi. */
  private readonly BOBOT_UTS = 0.3;

  /** Bobot nilai UAS sesuai ketentuan bisnis resmi. */
  private readonly BOBOT_UAS = 0.4;

  /** Batas minimum nilai akhir untuk status LULUS. */
  private readonly BATAS_LULUS = 70;
```

Potongan constructor:

```ts
constructor() {
  this.prisma = prisma;
}
```

Potongan method kalkulasi:

```ts
hitungNilaiAkhir(tugas: number, uts: number, uas: number): number {
  return this.BOBOT_TUGAS * tugas + this.BOBOT_UTS * uts + this.BOBOT_UAS * uas;
}

tentukanStatusKelulusan(nilaiAkhir: number): StatusKelulusan {
  return nilaiAkhir >= this.BATAS_LULUS
    ? StatusKelulusan.LULUS
    : StatusKelulusan.TIDAK_LULUS;
}
```

Potongan method input nilai:

```ts
async inputNilai(data: CreateNilaiInput): Promise<NilaiDenganRelasi> {
  this.pastikanSemuaNilaiValid(data.nilaiTugas, data.nilaiUTS, data.nilaiUAS);

  const nilaiAkhir = this.hitungNilaiAkhir(
    data.nilaiTugas,
    data.nilaiUTS,
    data.nilaiUAS
  );
  const statusKelulusan = this.tentukanStatusKelulusan(nilaiAkhir);

  return await this.prisma.nilai.create({
    data: {
      siswaId: data.siswaId,
      guruId: data.guruId,
      nilaiTugas: data.nilaiTugas,
      nilaiUTS: data.nilaiUTS,
      nilaiUAS: data.nilaiUAS,
      nilaiAkhir: Number(nilaiAkhir.toFixed(2)),
      statusKelulusan,
    },
    include: { siswa: true, guru: true },
  });
}
```

Potongan private method:

```ts
private pastikanSemuaNilaiValid(
  nilaiTugas: number,
  nilaiUTS: number,
  nilaiUAS: number
): void {
  const semuaNilaiValid = [nilaiTugas, nilaiUTS, nilaiUAS].every((nilai) =>
    this.validasiRentangNilai(nilai)
  );

  if (!semuaNilaiValid) {
    throw new Error("Nilai harus berada dalam rentang 0 sampai 100.");
  }
}
```

## Analisis OOP

| Unsur OOP | Bukti |
| --- | --- |
| Class | `export class NilaiService` |
| Encapsulation | `private prisma`, `private readonly BOBOT_TUGAS`, dan method private |
| Constructor | `constructor() { this.prisma = prisma; }` |
| Method | `inputNilai`, `updateNilai`, `getNilaiByGuru`, `getNilaiBySiswa` |
| Tanggung jawab jelas | Class hanya menangani domain nilai |

## Kesimpulan

Output 8 dan 9 telah terpenuhi:

1. Pemrograman terstruktur dibuktikan oleh fungsi-fungsi di `nilaiUtils.ts`.
2. Pemrograman OOP dibuktikan oleh `NilaiService` dengan class, property private, constructor, method, dan enkapsulasi.

