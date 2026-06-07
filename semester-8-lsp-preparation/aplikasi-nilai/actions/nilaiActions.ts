"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NilaiService } from "@/lib/services/NilaiService";
import { nilaiSchema, updateNilaiSchema } from "@/lib/validations";
import type { ActionResult, CreateNilaiInput, UpdateNilaiInput } from "@/types";

function getPesanErrorPrisma(error: Prisma.PrismaClientKnownRequestError): string {
  if (error.code === "P2002") {
    return "Nilai untuk siswa ini pada mata pelajaran ini sudah ada.";
  }
  if (error.code === "P2025") return "Data nilai tidak ditemukan.";
  if (error.code === "P2003") return "Data siswa atau guru tidak valid.";
  return "Terjadi kesalahan database.";
}

function revalidateNilaiPages(): void {
  revalidatePath("/admin");
  revalidatePath("/admin/nilai");
  revalidatePath("/admin/laporan");
  revalidatePath("/guru");
  revalidatePath("/guru/input-nilai");
  revalidatePath("/guru/rekap-nilai");
  revalidatePath("/siswa");
  revalidatePath("/siswa/nilai-saya");
}

/**
 * Menginput nilai siswa baru melalui NilaiService.
 * @param data - ID siswa, ID guru, dan komponen nilai
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function inputNilaiAction(data: CreateNilaiInput): Promise<ActionResult> {
  try {
    const validasi = nilaiSchema.safeParse(data);
    if (!validasi.success) {
      return {
        sukses: false,
        pesan: "Data nilai tidak valid. Pastikan semua nilai antara 0-100.",
        error: validasi.error.flatten(),
      };
    }

    const nilaiService = new NilaiService();
    await nilaiService.inputNilai(validasi.data);
    revalidateNilaiPages();

    return { sukses: true, pesan: "Nilai berhasil diinput." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[inputNilaiAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}

/**
 * Memperbarui data nilai yang sudah tersimpan.
 * @param data - ID nilai dan komponen nilai yang berubah
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function updateNilaiAction(
  data: UpdateNilaiInput & { id: string }
): Promise<ActionResult> {
  try {
    const validasi = updateNilaiSchema.safeParse(data);
    if (!validasi.success) {
      return {
        sukses: false,
        pesan: "Data nilai tidak valid. Periksa kembali isian form.",
        error: validasi.error.flatten(),
      };
    }

    const { id, ...payload } = validasi.data;
    const nilaiService = new NilaiService();
    await nilaiService.updateNilai(id, payload);
    revalidateNilaiPages();

    return { sukses: true, pesan: "Nilai berhasil diperbarui." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[updateNilaiAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}

/**
 * Menghapus satu entri nilai.
 * @param id - ID nilai yang akan dihapus
 * @returns Hasil aksi untuk ditampilkan di UI
 */
export async function hapusNilaiAction(id: string): Promise<ActionResult> {
  try {
    const nilaiService = new NilaiService();
    await nilaiService.hapusNilai(id);
    revalidateNilaiPages();

    return { sukses: true, pesan: "Nilai berhasil dihapus." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { sukses: false, pesan: getPesanErrorPrisma(error) };
    }

    console.error("[hapusNilaiAction] Error:", error);
    return { sukses: false, pesan: "Terjadi kesalahan pada server." };
  }
}
