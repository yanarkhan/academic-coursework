import { StatusKelulusan } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
import type {
  CreateNilaiInput,
  LaporanNilai,
  NilaiDenganRelasi,
  NilaiGuru,
  NilaiSiswa,
  UpdateNilaiInput,
} from "@/types";

/**
 * NilaiService - Class utama untuk logika bisnis pengolahan nilai siswa.
 * Class ini menjadi bukti OOP dengan property private, konstanta bisnis,
 * constructor, method kalkulasi, validasi, CRUD nilai, dan laporan.
 */
export class NilaiService {
  /** Instance Prisma Client yang diambil dari singleton global. */
  private prisma: PrismaClient;

  /** Bobot nilai tugas sesuai ketentuan bisnis resmi. */
  private readonly BOBOT_TUGAS = 0.3;

  /** Bobot nilai UTS sesuai ketentuan bisnis resmi. */
  private readonly BOBOT_UTS = 0.3;

  /** Bobot nilai UAS sesuai ketentuan bisnis resmi. */
  private readonly BOBOT_UAS = 0.4;

  /** Batas minimum nilai akhir untuk status LULUS. */
  private readonly BATAS_LULUS = 70;

  /**
   * Membuat instance NilaiService dan menghubungkannya ke Prisma singleton.
   */
  constructor() {
    this.prisma = prisma;
  }

  /**
   * Menghitung nilai akhir berdasarkan formula resmi.
   * @param tugas - Nilai tugas harian dengan rentang 0 sampai 100
   * @param uts - Nilai Ujian Tengah Semester dengan rentang 0 sampai 100
   * @param uas - Nilai Ujian Akhir Semester dengan rentang 0 sampai 100
   * @returns Nilai akhir hasil kalkulasi bobot 30%, 30%, dan 40%
   */
  hitungNilaiAkhir(tugas: number, uts: number, uas: number): number {
    return this.BOBOT_TUGAS * tugas + this.BOBOT_UTS * uts + this.BOBOT_UAS * uas;
  }

  /**
   * Menentukan status kelulusan berdasarkan nilai akhir.
   * @param nilaiAkhir - Nilai akhir hasil kalkulasi
   * @returns Enum status kelulusan dari Prisma
   */
  tentukanStatusKelulusan(nilaiAkhir: number): StatusKelulusan {
    return nilaiAkhir >= this.BATAS_LULUS
      ? StatusKelulusan.LULUS
      : StatusKelulusan.TIDAK_LULUS;
  }

  /**
   * Memvalidasi apakah nilai berada pada rentang sah.
   * @param nilai - Angka nilai yang akan diperiksa
   * @returns true jika nilai finite dan berada di rentang 0 sampai 100
   */
  validasiRentangNilai(nilai: number): boolean {
    return Number.isFinite(nilai) && nilai >= 0 && nilai <= 100;
  }

  /**
   * Menginput nilai baru untuk siswa dan menghitung hasil otomatis.
   * @param data - Data siswa, guru, dan komponen nilai
   * @returns Nilai baru beserta relasi siswa dan guru
   */
  async inputNilai(data: CreateNilaiInput): Promise<NilaiDenganRelasi> {
    this.pastikanSemuaNilaiValid(data.nilaiTugas, data.nilaiUTS, data.nilaiUAS);

    const nilaiAkhir = this.hitungNilaiAkhir(
      data.nilaiTugas,
      data.nilaiUTS,
      data.nilaiUAS
    );
    const statusKelulusan = this.tentukanStatusKelulusan(nilaiAkhir);

    return await this.prisma.nilai.create({
      data: {
        siswaId: data.siswaId,
        guruId: data.guruId,
        nilaiTugas: data.nilaiTugas,
        nilaiUTS: data.nilaiUTS,
        nilaiUAS: data.nilaiUAS,
        nilaiAkhir: Number(nilaiAkhir.toFixed(2)),
        statusKelulusan,
      },
      include: { siswa: true, guru: true },
    });
  }

  /**
   * Mengambil semua nilai untuk kebutuhan halaman Admin.
   * @returns Array nilai beserta relasi siswa dan guru
   */
  async getSemuaNilai(): Promise<NilaiDenganRelasi[]> {
    return await this.prisma.nilai.findMany({
      include: { siswa: true, guru: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Mengambil semua nilai milik seorang siswa.
   * @param siswaId - ID siswa
   * @returns Array nilai siswa beserta guru pengampu
   */
  async getNilaiBySiswa(siswaId: string): Promise<NilaiSiswa[]> {
    return await this.prisma.nilai.findMany({
      where: { siswaId },
      include: { guru: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Mengambil semua nilai yang diinput oleh seorang guru.
   * @param guruId - ID guru
   * @returns Array nilai beserta siswa yang dinilai
   */
  async getNilaiByGuru(guruId: string): Promise<NilaiGuru[]> {
    return await this.prisma.nilai.findMany({
      where: { guruId },
      include: { siswa: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Memperbarui komponen nilai dan menghitung ulang nilai akhir serta status.
   * @param id - ID nilai yang akan diperbarui
   * @param data - Komponen nilai yang berubah
   * @returns Nilai terbaru beserta relasi siswa dan guru
   */
  async updateNilai(
    id: string,
    data: UpdateNilaiInput
  ): Promise<NilaiDenganRelasi> {
    const nilaiLama = await this.prisma.nilai.findUniqueOrThrow({ where: { id } });

    const nilaiTugas = data.nilaiTugas ?? nilaiLama.nilaiTugas;
    const nilaiUTS = data.nilaiUTS ?? nilaiLama.nilaiUTS;
    const nilaiUAS = data.nilaiUAS ?? nilaiLama.nilaiUAS;

    this.pastikanSemuaNilaiValid(nilaiTugas, nilaiUTS, nilaiUAS);

    const nilaiAkhir = this.hitungNilaiAkhir(nilaiTugas, nilaiUTS, nilaiUAS);
    const statusKelulusan = this.tentukanStatusKelulusan(nilaiAkhir);

    return await this.prisma.nilai.update({
      where: { id },
      data: {
        nilaiTugas,
        nilaiUTS,
        nilaiUAS,
        nilaiAkhir: Number(nilaiAkhir.toFixed(2)),
        statusKelulusan,
      },
      include: { siswa: true, guru: true },
    });
  }

  /**
   * Menghapus satu entri nilai.
   * @param id - ID nilai yang akan dihapus
   * @returns Promise tanpa data saat penghapusan berhasil
   */
  async hapusNilai(id: string): Promise<void> {
    await this.prisma.nilai.delete({ where: { id } });
  }

  /**
   * Mengambil laporan lengkap semua nilai untuk Admin.
   * @returns Array nilai dengan relasi siswa, user siswa, dan guru
   */
  async getLaporanLengkap(): Promise<LaporanNilai[]> {
    return await this.prisma.nilai.findMany({
      include: {
        siswa: { include: { user: true } },
        guru: true,
      },
      orderBy: [{ siswa: { kelas: "asc" } }, { siswa: { nama: "asc" } }],
    });
  }

  /**
   * Memastikan semua komponen nilai valid sebelum disimpan.
   * @param nilaiTugas - Nilai tugas yang akan divalidasi
   * @param nilaiUTS - Nilai UTS yang akan divalidasi
   * @param nilaiUAS - Nilai UAS yang akan divalidasi
   * @throws Error jika salah satu nilai berada di luar rentang 0 sampai 100
   */
  private pastikanSemuaNilaiValid(
    nilaiTugas: number,
    nilaiUTS: number,
    nilaiUAS: number
  ): void {
    const semuaNilaiValid = [nilaiTugas, nilaiUTS, nilaiUAS].every((nilai) =>
      this.validasiRentangNilai(nilai)
    );

    if (!semuaNilaiValid) {
      throw new Error("Nilai harus berada dalam rentang 0 sampai 100.");
    }
  }
}
