import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLaporanFilter } from "@/components/admin/AdminLaporanFilter";
import {
  LaporanNilaiPrintSection,
  type LaporanNilaiRow,
} from "@/components/admin/LaporanNilaiPrintSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { NilaiService } from "@/lib/services/NilaiService";
import { formatNilai } from "@/lib/utils/nilaiUtils";

export const metadata: Metadata = {
  title: "Laporan Admin | Sistem Pengolahan Nilai",
};

type AdminLaporanPageProps = {
  searchParams: Promise<{ kelas?: string; mapel?: string }>;
};

export default async function AdminLaporanPage({
  searchParams,
}: AdminLaporanPageProps) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const params = await searchParams;
  const nilaiService = new NilaiService();
  const semuaLaporan = await nilaiService.getLaporanLengkap();
  const laporan = semuaLaporan.filter((nilai) => {
    const cocokKelas = params.kelas ? nilai.siswa.kelas === params.kelas : true;
    const cocokMapel = params.mapel
      ? nilai.guru.mataPelajaran === params.mapel
      : true;

    return cocokKelas && cocokMapel;
  });
  const totalNilai = laporan.length;
  const totalLulus = laporan.filter(
    (nilai) => nilai.statusKelulusan === "LULUS"
  ).length;
  const totalTidakLulus = totalNilai - totalLulus;
  const rataRataKelas =
    totalNilai > 0
      ? laporan.reduce((total, nilai) => total + nilai.nilaiAkhir, 0) /
        totalNilai
      : 0;
  const persentaseLulus =
    totalNilai > 0 ? Math.round((totalLulus / totalNilai) * 100) : 0;
  const distribusiNilai = laporan
    .slice(0, 8)
    .map((nilai) => Math.max(8, Math.round(nilai.nilaiAkhir)));
  const rows: LaporanNilaiRow[] = laporan.map((nilai) => ({
    id: nilai.id,
    siswa: nilai.siswa.nama,
    kelas: nilai.siswa.kelas,
    mataPelajaran: nilai.guru.mataPelajaran,
    guru: nilai.guru.namaGuru,
    tugas: nilai.nilaiTugas,
    uts: nilai.nilaiUTS,
    uas: nilai.nilaiUAS,
    nilaiAkhir: nilai.nilaiAkhir,
    status: nilai.statusKelulusan === "LULUS" ? "LULUS" : "TIDAK_LULUS",
  }));
  const daftarKelas = Array.from(
    new Set(semuaLaporan.map((nilai) => nilai.siswa.kelas))
  ).sort();
  const daftarMapel = Array.from(
    new Set(semuaLaporan.map((nilai) => nilai.guru.mataPelajaran))
  ).sort();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            Laporan Akademik
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Konfigurasi dan lihat rekap performa siswa per semester.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <AdminLaporanFilter
          daftarKelas={daftarKelas}
          daftarMapel={daftarMapel}
        />

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Ringkasan Akademik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-sm text-primary">Rata-rata Kelas</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatNilai(rataRataKelas)}
                </p>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-sm text-muted-foreground">Total Data</p>
                <p className="mt-2 text-3xl font-semibold">{totalNilai}</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">Total Lulus</p>
                <p className="mt-2 text-3xl font-semibold">{totalLulus}</p>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm text-red-700">Tidak Lulus</p>
                <p className="mt-2 text-3xl font-semibold">
                  {totalTidakLulus}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-xl border bg-slate-50 p-6">
                <h2 className="text-lg font-semibold">Distribusi Nilai</h2>
                <div className="mt-5 flex h-44 items-end gap-3 rounded-xl bg-white/70 p-4">
                  {distribusiNilai.length > 0 ? (
                    distribusiNilai.map((height, index) => (
                      <div
                        key={height + index}
                        className="flex flex-1 items-end rounded-t-lg bg-primary/15"
                        style={{ height: `${height}%` }}
                      >
                        <div
                          className="w-full rounded-t-lg bg-primary"
                          style={{ height: `${Math.max(height - 16, 20)}%` }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                      Data nilai belum tersedia.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <div className="mx-auto flex size-40 items-center justify-center rounded-full border-[16px] border-primary bg-white">
                  <div className="text-center">
                    <p className="text-4xl font-semibold">
                      {persentaseLulus}%
                    </p>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Lulus
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-primary" />
                      Lulus KKM
                    </span>
                    <span className="font-semibold">{totalLulus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-red-500" />
                      Di Bawah KKM
                    </span>
                    <span className="font-semibold">{totalTidakLulus}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <LaporanNilaiPrintSection data={rows} />
      </div>
    </div>
  );
}
