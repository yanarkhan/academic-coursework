import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  ClipboardList,
  FileText,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { AdminStatsChart } from "@/components/admin/AdminStatsChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { GuruService } from "@/lib/services/GuruService";
import { NilaiService } from "@/lib/services/NilaiService";
import { SiswaService } from "@/lib/services/SiswaService";

export const metadata: Metadata = {
  title: "Dashboard Admin | Sistem Pengolahan Nilai",
};

export default async function AdminDashboardPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const siswaService = new SiswaService();
  const guruService = new GuruService();
  const nilaiService = new NilaiService();
  const [daftarSiswa, daftarGuru, daftarNilai] = await Promise.all([
    siswaService.getDaftarSiswa(),
    guruService.getDaftarGuru(),
    nilaiService.getSemuaNilai(),
  ]);

  const totalLulus = daftarNilai.filter(
    (nilai) => nilai.statusKelulusan === "LULUS"
  ).length;
  const persentaseKelulusan =
    daftarNilai.length > 0
      ? Math.round((totalLulus / daftarNilai.length) * 100)
      : 0;

  const kelasMap = new Map<
    string,
    { jumlahSiswa: number; totalNilai: number; totalEntri: number }
  >();

  daftarSiswa.forEach((siswa) => {
    const current = kelasMap.get(siswa.kelas) ?? {
      jumlahSiswa: 0,
      totalNilai: 0,
      totalEntri: 0,
    };
    kelasMap.set(siswa.kelas, {
      ...current,
      jumlahSiswa: current.jumlahSiswa + 1,
    });
  });

  daftarNilai.forEach((nilai) => {
    const current = kelasMap.get(nilai.siswa.kelas) ?? {
      jumlahSiswa: 0,
      totalNilai: 0,
      totalEntri: 0,
    };
    kelasMap.set(nilai.siswa.kelas, {
      ...current,
      totalNilai: current.totalNilai + nilai.nilaiAkhir,
      totalEntri: current.totalEntri + 1,
    });
  });

  const chartData = Array.from(kelasMap.entries())
    .map(([kelas, item]) => ({
      kelas,
      jumlahSiswa: item.jumlahSiswa,
      rataRataNilai:
        item.totalEntri > 0
          ? Number((item.totalNilai / item.totalEntri).toFixed(2))
          : 0,
    }))
    .sort((a, b) => a.kelas.localeCompare(b.kelas));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            Statistik Sistem
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ringkasan aktivitas akademik dan data institusi terkini.
          </p>
        </div>
        <Button asChild className="h-11 rounded-xl px-5 font-semibold shadow-sm">
          <Link href="/admin/laporan">
            <FileText className="size-4" />
            Buat Laporan
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="size-6" />
              </div>
              <span className="text-sm font-semibold text-primary">Aktif</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Siswa</p>
            <p className="mt-2 text-4xl font-semibold tracking-normal">
              {daftarSiswa.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <GraduationCap className="size-6" />
              </div>
              <span className="text-sm font-semibold text-foreground">Tetap</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Guru</p>
            <p className="mt-2 text-4xl font-semibold tracking-normal">
              {daftarGuru.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <ClipboardList className="size-6" />
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold uppercase text-primary">
                Aktif
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Nilai Diinput</p>
            <p className="mt-2 text-4xl font-semibold tracking-normal">
              {daftarNilai.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Award className="size-6" />
              </div>
              <span className="text-sm font-semibold text-primary">
                Target 90%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Rata-rata Kelulusan</p>
            <p className="mt-2 text-4xl font-semibold tracking-normal text-primary">
              {persentaseKelulusan}%
            </p>
          </CardContent>
        </Card>
      </div>

      <AdminStatsChart data={chartData} />
    </div>
  );
}
