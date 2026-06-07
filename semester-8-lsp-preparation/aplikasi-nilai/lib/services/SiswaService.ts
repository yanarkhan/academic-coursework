import type { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type {
  CreateSiswaInput,
  SiswaDenganUser,
  SiswaDetail,
  UpdateSiswaInput,
} from "@/types";

/**
 * SiswaService - Mengelola semua operasi CRUD untuk entitas Siswa.
 * Class ini menjadi bukti OOP karena mengenkapsulasi akses database
 * dan logika bisnis siswa dalam satu service yang kohesif.
 */
export class SiswaService {
  /** Instance Prisma Client yang diambil dari singleton global. */
  private prisma: PrismaClient;

  /**
   * Membuat instance SiswaService dan menghubungkannya ke Prisma singleton.
   */
  constructor() {
    this.prisma = prisma;
  }

  /**
   * Menambah siswa baru beserta akun User role SISWA secara atomik.
   * @param data - Data siswa dan kredensial akun login siswa
   * @returns Data siswa yang baru dibuat beserta relasi user
   */
  async tambahSiswa(data: CreateSiswaInput): Promise<SiswaDenganUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.prisma.siswa.create({
      data: {
        nis: data.nis,
        nama: data.nama,
        kelas: data.kelas,
        user: {
          create: {
            username: data.username,
            password: hashedPassword,
            role: "SISWA",
          },
        },
      },
      include: { user: true },
    });
  }

  /**
   * Mengambil seluruh daftar siswa beserta akun user terkait.
   * @returns Array data siswa yang diurutkan dari data terbaru
   */
  async getDaftarSiswa(): Promise<SiswaDenganUser[]> {
    return await this.prisma.siswa.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Mengambil detail satu siswa berdasarkan ID.
   * @param id - ID unik siswa
   * @returns Detail siswa, atau null jika tidak ditemukan
   */
  async getSiswaById(id: string): Promise<SiswaDetail | null> {
    return await this.prisma.siswa.findUnique({
      where: { id },
      include: {
        user: true,
        nilai: { include: { guru: true } },
      },
    });
  }

  /**
   * Mengambil data siswa berdasarkan userId dari session login.
   * @param userId - ID user yang sedang login
   * @returns Data siswa beserta user, atau null jika user bukan siswa
   */
  async getSiswaByUserId(userId: string): Promise<SiswaDenganUser | null> {
    return await this.prisma.siswa.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  /**
   * Memperbarui data siswa dan akun login terkait jika dikirim.
   * @param id - ID siswa yang akan diperbarui
   * @param data - Field siswa atau akun yang ingin diperbarui
   * @returns Data siswa terbaru beserta user
   */
  async updateSiswa(id: string, data: UpdateSiswaInput): Promise<SiswaDenganUser> {
    const updateData: Prisma.SiswaUpdateInput = {};

    if (data.nis !== undefined) updateData.nis = data.nis;
    if (data.nama !== undefined) updateData.nama = data.nama;
    if (data.kelas !== undefined) updateData.kelas = data.kelas;

    const userUpdateData: Prisma.UserUpdateWithoutSiswaInput = {};
    if (data.username !== undefined) userUpdateData.username = data.username;
    if (data.password !== undefined && data.password.trim() !== "") {
      userUpdateData.password = await bcrypt.hash(data.password, 10);
    }

    if (Object.keys(userUpdateData).length > 0) {
      updateData.user = { update: userUpdateData };
    }

    return await this.prisma.siswa.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });
  }

  /**
   * Menghapus siswa beserta akun User terkait melalui cascade dari tabel User.
   * @param id - ID siswa yang akan dihapus
   * @returns Promise tanpa data saat penghapusan berhasil
   */
  async hapusSiswa(id: string): Promise<void> {
    const siswa = await this.prisma.siswa.findUniqueOrThrow({
      where: { id },
      select: { userId: true },
    });

    await this.prisma.user.delete({ where: { id: siswa.userId } });
  }
}
