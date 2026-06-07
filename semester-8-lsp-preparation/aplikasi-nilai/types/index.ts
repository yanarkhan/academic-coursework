import type { Prisma, Role, StatusKelulusan } from "@prisma/client";

export type { Role, StatusKelulusan };

/**
 * Format return standar untuk seluruh Server Action.
 * @template T - Tipe data opsional yang dikembalikan saat aksi berhasil
 */
export type ActionResult<T = undefined> = {
  sukses: boolean;
  pesan: string;
  data?: T;
  error?: unknown;
};

/** Data input untuk membuat siswa dan akun login siswa. */
export type CreateSiswaInput = {
  nis: string;
  nama: string;
  kelas: string;
  username: string;
  password: string;
};

/** Data input untuk memperbarui siswa dan akun login terkait. */
export type UpdateSiswaInput = Partial<CreateSiswaInput>;

/** Data input untuk membuat guru dan akun login guru. */
export type CreateGuruInput = {
  idGuru: string;
  namaGuru: string;
  mataPelajaran: string;
  username: string;
  password: string;
};

/** Data input untuk memperbarui guru dan akun login terkait. */
export type UpdateGuruInput = Partial<CreateGuruInput>;

/** Data input untuk membuat nilai baru. */
export type CreateNilaiInput = {
  siswaId: string;
  guruId: string;
  nilaiTugas: number;
  nilaiUTS: number;
  nilaiUAS: number;
};

/** Data input untuk memperbarui komponen nilai. */
export type UpdateNilaiInput = Partial<
  Pick<CreateNilaiInput, "nilaiTugas" | "nilaiUTS" | "nilaiUAS">
>;

/** Data siswa beserta akun user terkait. */
export type SiswaDenganUser = Prisma.SiswaGetPayload<{
  include: { user: true };
}>;

/** Detail siswa beserta user, nilai, dan guru penginput nilai. */
export type SiswaDetail = Prisma.SiswaGetPayload<{
  include: { user: true; nilai: { include: { guru: true } } };
}>;

/** Data guru beserta akun user terkait. */
export type GuruDenganUser = Prisma.GuruGetPayload<{
  include: { user: true };
}>;

/** Nilai beserta relasi siswa dan guru. */
export type NilaiDenganRelasi = Prisma.NilaiGetPayload<{
  include: { siswa: true; guru: true };
}>;

/** Nilai milik siswa beserta guru pengampu. */
export type NilaiSiswa = Prisma.NilaiGetPayload<{
  include: { guru: true };
}>;

/** Nilai milik guru beserta siswa yang dinilai. */
export type NilaiGuru = Prisma.NilaiGetPayload<{
  include: { siswa: true };
}>;

/** Baris laporan lengkap nilai untuk Admin. */
export type LaporanNilai = Prisma.NilaiGetPayload<{
  include: { siswa: { include: { user: true } }; guru: true };
}>;
