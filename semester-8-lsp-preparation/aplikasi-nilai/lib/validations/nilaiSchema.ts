import { z } from "zod";

/** Skema angka nilai dengan rentang resmi 0 sampai 100. */
const nilaiAngkaSchema = z.coerce
  .number()
  .min(0, "Nilai tidak boleh kurang dari 0")
  .max(100, "Nilai tidak boleh lebih dari 100");

/** Skema validasi untuk input nilai baru. */
export const nilaiSchema = z.object({
  siswaId: z.string().cuid("ID siswa tidak valid"),
  guruId: z.string().cuid("ID guru tidak valid"),
  nilaiTugas: nilaiAngkaSchema,
  nilaiUTS: nilaiAngkaSchema,
  nilaiUAS: nilaiAngkaSchema,
});

/** Skema validasi untuk memperbarui nilai. */
export const updateNilaiSchema = z
  .object({
    id: z.string().cuid("ID nilai tidak valid"),
    nilaiTugas: nilaiAngkaSchema.optional(),
    nilaiUTS: nilaiAngkaSchema.optional(),
    nilaiUAS: nilaiAngkaSchema.optional(),
  })
  .refine(
    (data) =>
      data.nilaiTugas !== undefined ||
      data.nilaiUTS !== undefined ||
      data.nilaiUAS !== undefined,
    "Minimal satu komponen nilai harus diisi"
  );

export type InputNilaiData = z.infer<typeof nilaiSchema>;
export type UpdateNilaiData = z.infer<typeof updateNilaiSchema>;
