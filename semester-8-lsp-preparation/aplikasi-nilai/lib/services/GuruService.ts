import type { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type {
  CreateGuruInput,
  GuruDenganUser,
  UpdateGuruInput,
} from "@/types";

/**
 * GuruService - Mengelola semua operasi CRUD untuk entitas Guru.
 * Class ini mengenkapsulasi akses database dan pembuatan akun User
 * role GURU agar logika guru tidak tersebar di komponen UI.
 */
export class GuruService {
  /** Instance Prisma Client yang diambil dari singleton global. */
  private prisma: PrismaClient;

  /**
   * Membuat instance GuruService dan menghubungkannya ke Prisma singleton.
   */
  constructor() {
    this.prisma = prisma;
  }

  /**
   * Menambah guru baru beserta akun User role GURU secara atomik.
   * @param data - Data guru dan kredensial akun login guru
   * @returns Data guru yang baru dibuat beserta relasi user
   */
  async tambahGuru(data: CreateGuruInput): Promise<GuruDenganUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.prisma.guru.create({
      data: {
        idGuru: data.idGuru,
        namaGuru: data.namaGuru,
        mataPelajaran: data.mataPelajaran,
        user: {
          create: {
            username: data.username,
            password: hashedPassword,
            role: "GURU",
          },
        },
      },
      include: { user: true },
    });
  }

  /**
   * Mengambil seluruh daftar guru beserta akun user terkait.
   * @returns Array data guru yang diurutkan dari data terbaru
   */
  async getDaftarGuru(): Promise<GuruDenganUser[]> {
    return await this.prisma.guru.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Mengambil satu guru berdasarkan ID guru internal.
   * @param id - ID unik guru
   * @returns Data guru beserta user, atau null jika tidak ditemukan
   */
  async getGuruById(id: string): Promise<GuruDenganUser | null> {
    return await this.prisma.guru.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  /**
   * Mengambil data guru berdasarkan userId dari session login.
   * @param userId - ID user yang sedang login
   * @returns Data guru, atau null jika user bukan guru
   */
  async getGuruByUserId(userId: string): Promise<GuruDenganUser | null> {
    return await this.prisma.guru.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  /**
   * Memperbarui data guru dan akun login terkait jika dikirim.
   * @param id - ID guru yang akan diperbarui
   * @param data - Field guru atau akun yang ingin diperbarui
   * @returns Data guru terbaru beserta user
   */
  async updateGuru(id: string, data: UpdateGuruInput): Promise<GuruDenganUser> {
    const updateData: Prisma.GuruUpdateInput = {};

    if (data.idGuru !== undefined) updateData.idGuru = data.idGuru;
    if (data.namaGuru !== undefined) updateData.namaGuru = data.namaGuru;
    if (data.mataPelajaran !== undefined) {
      updateData.mataPelajaran = data.mataPelajaran;
    }

    const userUpdateData: Prisma.UserUpdateWithoutGuruInput = {};
    if (data.username !== undefined) userUpdateData.username = data.username;
    if (data.password !== undefined && data.password.trim() !== "") {
      userUpdateData.password = await bcrypt.hash(data.password, 10);
    }

    if (Object.keys(userUpdateData).length > 0) {
      updateData.user = { update: userUpdateData };
    }

    return await this.prisma.guru.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });
  }

  /**
   * Menghapus guru beserta akun User terkait melalui cascade dari tabel User.
   * @param id - ID guru yang akan dihapus
   * @returns Promise tanpa data saat penghapusan berhasil
   */
  async hapusGuru(id: string): Promise<void> {
    const guru = await this.prisma.guru.findUniqueOrThrow({
      where: { id },
      select: { userId: true },
    });

    await this.prisma.user.delete({ where: { id: guru.userId } });
  }
}
