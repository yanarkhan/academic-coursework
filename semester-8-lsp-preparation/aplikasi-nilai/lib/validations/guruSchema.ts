import { z } from "zod";

/** Skema validasi untuk membuat guru baru beserta akun login. */
export const guruSchema = z.object({
  idGuru: z
    .string()
    .trim()
    .min(1, "ID Guru wajib diisi")
    .max(30, "ID Guru terlalu panjang"),
  namaGuru: z
    .string()
    .trim()
    .min(1, "Nama guru wajib diisi")
    .max(100, "Nama guru terlalu panjang"),
  mataPelajaran: z
    .string()
    .trim()
    .min(1, "Mata pelajaran wajib diisi")
    .max(100, "Mata pelajaran terlalu panjang"),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username terlalu panjang"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password terlalu panjang"),
});

/** Skema validasi untuk memperbarui data guru. */
export const updateGuruSchema = guruSchema.partial().extend({
  id: z.string().cuid("ID guru tidak valid"),
});

export type GuruSchema = z.infer<typeof guruSchema>;
export type UpdateGuruSchema = z.infer<typeof updateGuruSchema>;
