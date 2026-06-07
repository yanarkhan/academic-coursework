"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { SiswaService } from "@/lib/services/SiswaService";
import { siswaSchema, updateSiswaSchema } from "@/lib/validations";
import type { ActionResult, CreateSiswaInput, UpdateSiswaInput } from "@/types";

function getPesanErrorPrisma(error: Prisma.PrismaClientKnownRequestError): string {
  if (error.code === "P2002") return "NIS atau username sudah terdaftar.";
  if (error.code === "P2025") return "Data siswa tidak ditemukan.";
  if (error.code === "P2003") return "Data terkait tidak valid.";
  return "Terjadi kesalahan database.";
}

function revalidateSiswaPages(): void {
  revalidatePath("/admin");
  revalidatePath("/admin/siswa");
  revalidatePath("/siswa");
  revalidatePath("/siswa/nilai-saya");
}

/**
 * Menambah siswa baru beserta akun login siswa.
 * @param data - Data siswa dan kredensial akun
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function tambahSiswaAction(
  data: CreateSiswaInput
): Promise<ActionResult> {
  try {
    const validasi = siswaSchema.safeParse(data);
    if (!validasi.success) {
      return {
        sukses: false,
        pesan: "Data siswa tidak valid. Periksa kembali isian form.",
        error: validasi.error.flatten(),
      };
    }

    const siswaService = new SiswaService();
    await siswaService.tambahSiswa(validasi.data);
    revalidateSiswaPages();

    return { sukses: true, pesan: "Data siswa berhasil ditambahkan." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[tambahSiswaAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}

/**
 * Memperbarui data siswa dan akun login terkait.
 * @param data - Data siswa yang akan diperbarui
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function updateSiswaAction(
  data: UpdateSiswaInput & { id: string }
): Promise<ActionResult> {
  try {
    const validasi = updateSiswaSchema.safeParse({
      ...data,
      password: data.password?.trim() ? data.password : undefined,
    });

    if (!validasi.success) {
      return {
        sukses: false,
        pesan: "Data siswa tidak valid. Periksa kembali isian form.",
        error: validasi.error.flatten(),
      };
    }

    const { id, ...payload } = validasi.data;
    const siswaService = new SiswaService();
    await siswaService.updateSiswa(id, payload);
    revalidateSiswaPages();

    return { sukses: true, pesan: "Data siswa berhasil diperbarui." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[updateSiswaAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}

/**
 * Menghapus siswa berdasarkan ID.
 * @param id - ID siswa yang akan dihapus
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function hapusSiswaAction(id: string): Promise<ActionResult> {
  try {
    const siswaService = new SiswaService();
    await siswaService.hapusSiswa(id);
    revalidateSiswaPages();

    return { sukses: true, pesan: "Data siswa berhasil dihapus." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[hapusSiswaAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}
