import { z } from "zod";

/** Skema validasi untuk membuat siswa baru beserta akun login. */
export const siswaSchema = z.object({
  nis: z.string().trim().min(1, "NIS wajib diisi").max(30, "NIS terlalu panjang"),
  nama: z
    .string()
    .trim()
    .min(1, "Nama siswa wajib diisi")
    .max(100, "Nama siswa terlalu panjang"),
  kelas: z
    .string()
    .trim()
    .min(1, "Kelas wajib diisi")
    .max(20, "Kelas terlalu panjang"),
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

/** Skema validasi untuk memperbarui data siswa. */
export const updateSiswaSchema = siswaSchema.partial().extend({
  id: z.string().cuid("ID siswa tidak valid"),
});

export type SiswaSchema = z.infer<typeof siswaSchema>;
export type UpdateSiswaSchema = z.infer<typeof updateSiswaSchema>;
