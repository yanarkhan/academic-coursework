import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

config({ path: resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL tidak ditemukan");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Memulai proses seeding database...");

  // Hash password yang sama untuk semua akun demo
  const passwordAdmin = await bcrypt.hash("admin123", 10);
  const passwordGuru = await bcrypt.hash("guru123", 10);
  const passwordSiswa = await bcrypt.hash("siswa123", 10);

  // === SEED: ADMIN ===
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: passwordAdmin, role: "ADMIN" },
  });

  // === SEED: 3 GURU ===
  const guruData = [
    {
      idGuru: "G001",
      namaGuru: "Budi Santoso",
      mataPelajaran: "Matematika",
      username: "guru_matematika",
    },
    {
      idGuru: "G002",
      namaGuru: "Siti Aminah",
      mataPelajaran: "Bahasa Indonesia",
      username: "guru_bahasa",
    },
    {
      idGuru: "G003",
      namaGuru: "Ahmad Fauzi",
      mataPelajaran: "IPA",
      username: "guru_ipa",
    },
  ];

  const guruTersimpan: { [key: string]: { id: string } } = {};

  for (const g of guruData) {
    const user = await prisma.user.upsert({
      where: { username: g.username },
      update: {},
      create: { username: g.username, password: passwordGuru, role: "GURU" },
    });
    const guru = await prisma.guru.upsert({
      where: { idGuru: g.idGuru },
      update: {},
      create: {
        idGuru: g.idGuru,
        namaGuru: g.namaGuru,
        mataPelajaran: g.mataPelajaran,
        userId: user.id,
      },
    });
    guruTersimpan[g.idGuru] = guru;
  }

  // === SEED: 10 SISWA ===
  const siswaData = [
    {
      nis: "2024001",
      nama: "Andi Pratama",
      kelas: "X-A",
      username: "siswa_001",
    },
    {
      nis: "2024002",
      nama: "Bela Safitri",
      kelas: "X-A",
      username: "siswa_002",
    },
    {
      nis: "2024003",
      nama: "Cahyo Nugroho",
      kelas: "X-B",
      username: "siswa_003",
    },
    {
      nis: "2024004",
      nama: "Dewi Rahayu",
      kelas: "X-B",
      username: "siswa_004",
    },
    { nis: "2024005", nama: "Eka Wijaya", kelas: "X-A", username: "siswa_005" },
    {
      nis: "2024006",
      nama: "Fajar Ramadhan",
      kelas: "X-C",
      username: "siswa_006",
    },
    {
      nis: "2024007",
      nama: "Gita Permata",
      kelas: "X-C",
      username: "siswa_007",
    },
    {
      nis: "2024008",
      nama: "Hendra Saputra",
      kelas: "X-B",
      username: "siswa_008",
    },
    {
      nis: "2024009",
      nama: "Indah Lestari",
      kelas: "X-A",
      username: "siswa_009",
    },
    {
      nis: "2024010",
      nama: "Joko Susanto",
      kelas: "X-C",
      username: "siswa_010",
    },
  ];

  const siswaTersimpan: { [key: string]: { id: string } } = {};

  for (const s of siswaData) {
    const user = await prisma.user.upsert({
      where: { username: s.username },
      update: {},
      create: { username: s.username, password: passwordSiswa, role: "SISWA" },
    });
    const siswa = await prisma.siswa.upsert({
      where: { nis: s.nis },
      update: {},
      create: { nis: s.nis, nama: s.nama, kelas: s.kelas, userId: user.id },
    });
    siswaTersimpan[s.nis] = siswa;
  }

  // === SEED: NILAI (beberapa contoh) ===
  const nilaiContoh = [
    {
      siswaId: siswaTersimpan["2024001"].id,
      guruId: guruTersimpan["G001"].id,
      nilaiTugas: 80,
      nilaiUTS: 75,
      nilaiUAS: 85,
    },
    {
      siswaId: siswaTersimpan["2024001"].id,
      guruId: guruTersimpan["G002"].id,
      nilaiTugas: 70,
      nilaiUTS: 65,
      nilaiUAS: 72,
    },
    {
      siswaId: siswaTersimpan["2024002"].id,
      guruId: guruTersimpan["G001"].id,
      nilaiTugas: 60,
      nilaiUTS: 55,
      nilaiUAS: 65,
    },
    {
      siswaId: siswaTersimpan["2024003"].id,
      guruId: guruTersimpan["G003"].id,
      nilaiTugas: 90,
      nilaiUTS: 88,
      nilaiUAS: 92,
    },
  ];

  for (const n of nilaiContoh) {
    const nilaiAkhir = 0.3 * n.nilaiTugas + 0.3 * n.nilaiUTS + 0.4 * n.nilaiUAS;
    const statusKelulusan = nilaiAkhir >= 70 ? "LULUS" : "TIDAK_LULUS";

    await prisma.nilai.upsert({
      where: { siswaId_guruId: { siswaId: n.siswaId, guruId: n.guruId } },
      update: {},
      create: {
        ...n,
        nilaiAkhir: parseFloat(nilaiAkhir.toFixed(2)),
        statusKelulusan,
      },
    });
  }

  console.log("Seeding selesai! Database siap untuk demo ujian.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
