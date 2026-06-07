"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { GuruService } from "@/lib/services/GuruService";
import { guruSchema, updateGuruSchema } from "@/lib/validations";
import type { ActionResult, CreateGuruInput, UpdateGuruInput } from "@/types";

function getPesanErrorPrisma(error: Prisma.PrismaClientKnownRequestError): string {
  if (error.code === "P2002") return "ID Guru atau username sudah terdaftar.";
  if (error.code === "P2025") return "Data guru tidak ditemukan.";
  if (error.code === "P2003") return "Data terkait tidak valid.";
  return "Terjadi kesalahan database.";
}

function revalidateGuruPages(): void {
  revalidatePath("/admin");
  revalidatePath("/admin/guru");
  revalidatePath("/guru");
}

/**
 * Menambah guru baru beserta akun login guru.
 * @param data - Data guru dan kredensial akun
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function tambahGuruAction(data: CreateGuruInput): Promise<ActionResult> {
  try {
    const validasi = guruSchema.safeParse(data);
    if (!validasi.success) {
      return {
        sukses: false,
        pesan: "Data guru tidak valid. Periksa kembali isian form.",
        error: validasi.error.flatten(),
      };
    }

    const guruService = new GuruService();
    await guruService.tambahGuru(validasi.data);
    revalidateGuruPages();

    return { sukses: true, pesan: "Data guru berhasil ditambahkan." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[tambahGuruAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}

/**
 * Memperbarui data guru dan akun login terkait.
 * @param data - Data guru yang akan diperbarui
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function updateGuruAction(
  data: UpdateGuruInput & { id: string }
): Promise<ActionResult> {
  try {
    const validasi = updateGuruSchema.safeParse({
      ...data,
      password: data.password?.trim() ? data.password : undefined,
    });

    if (!validasi.success) {
      return {
        sukses: false,
        pesan: "Data guru tidak valid. Periksa kembali isian form.",
        error: validasi.error.flatten(),
      };
    }

    const { id, ...payload } = validasi.data;
    const guruService = new GuruService();
    await guruService.updateGuru(id, payload);
    revalidateGuruPages();

    return { sukses: true, pesan: "Data guru berhasil diperbarui." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[updateGuruAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}

/**
 * Menghapus guru berdasarkan ID.
 * @param id - ID guru yang akan dihapus
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function hapusGuruAction(id: string): Promise<ActionResult> {
  try {
    const guruService = new GuruService();
    await guruService.hapusGuru(id);
    revalidateGuruPages();

    return { sukses: true, pesan: "Data guru berhasil dihapus." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[hapusGuruAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}
