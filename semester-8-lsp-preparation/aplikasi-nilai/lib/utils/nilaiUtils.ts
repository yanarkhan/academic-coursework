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

/**
 * Menghitung nilai akhir berdasarkan formula resmi.
 * @param nilaiTugas - Nilai tugas harian dengan rentang 0 sampai 100
 * @param nilaiUTS - Nilai Ujian Tengah Semester dengan rentang 0 sampai 100
 * @param nilaiUAS - Nilai Ujian Akhir Semester dengan rentang 0 sampai 100
 * @returns Nilai akhir hasil kalkulasi bobot 30%, 30%, dan 40%
 */
export function hitungNilaiAkhir(
  nilaiTugas: number,
  nilaiUTS: number,
  nilaiUAS: number
): number {
  return BOBOT_TUGAS * nilaiTugas + BOBOT_UTS * nilaiUTS + BOBOT_UAS * nilaiUAS;
}

/**
 * Menentukan status kelulusan berdasarkan nilai akhir.
 * @param nilaiAkhir - Nilai akhir hasil kalkulasi
 * @returns Status LULUS jika nilai akhir minimal 70, selain itu TIDAK_LULUS
 */
export function tentukanStatusKelulusan(nilaiAkhir: number): StatusKelulusanNilai {
  return nilaiAkhir >= BATAS_KELULUSAN ? "LULUS" : "TIDAK_LULUS";
}

/**
 * Memvalidasi apakah nilai berada pada rentang sah.
 * @param nilai - Angka nilai yang akan diperiksa
 * @returns true jika nilai finite dan berada di rentang 0 sampai 100
 */
export function validasiRentangNilai(nilai: number): boolean {
  return Number.isFinite(nilai) && nilai >= 0 && nilai <= 100;
}

/**
 * Memformat nilai untuk tampilan antarmuka.
 * @param nilai - Angka nilai yang akan diformat
 * @returns String nilai dengan dua digit desimal
 */
export function formatNilai(nilai: number): string {
  return nilai.toFixed(2);
}

/**
 * Menentukan variant Badge Shadcn berdasarkan status kelulusan.
 * @param status - Status kelulusan siswa
 * @returns default untuk LULUS dan destructive untuk TIDAK_LULUS
 */
export function getVarianBadgeStatus(status: string): VarianBadgeStatus {
  return status === "LULUS" ? "default" : "destructive";
}
