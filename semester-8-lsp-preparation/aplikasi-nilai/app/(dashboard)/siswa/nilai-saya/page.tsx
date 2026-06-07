import type { Metadata } from "next";
import {
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  LibraryBig,
  TrendingUp,
} from "lucide-react";
import { redirect } from "next/navigation";
import { TabelNilai, type NilaiRow } from "@/components/nilai/TabelNilai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { NilaiService } from "@/lib/services/NilaiService";
import { SiswaService } from "@/lib/services/SiswaService";
import { formatNilai } from "@/lib/utils/nilaiUtils";

export const metadata: Metadata = {
  title: "Nilai Saya | Sistem Pengolahan Nilai",
};

export default async function SiswaNilaiSayaPage() {
  const session = await auth();

  if (session?.user?.role !== "SISWA") {
    redirect("/login");
  }

  const siswaService = new SiswaService();
  const nilaiService = new NilaiService();
  const siswa = await siswaService.getSiswaByUserId(session.user.id);

  if (!siswa) {
    redirect("/login");
  }

  const daftarNilai = await nilaiService.getNilaiBySiswa(siswa.id);
  const rows: NilaiRow[] = daftarNilai.map((nilai) => ({
    id: nilai.id,
    siswaNama: siswa.nama,
    siswaKelas: siswa.kelas,
    guruNama: nilai.guru.namaGuru,
    mataPelajaran: nilai.guru.mataPelajaran,
    nilaiTugas: nilai.nilaiTugas,
    nilaiUTS: nilai.nilaiUTS,
    nilaiUAS: nilai.nilaiUAS,
    nilaiAkhir: nilai.nilaiAkhir,
    statusKelulusan:
      nilai.statusKelulusan === "LULUS" ? "LULUS" : "TIDAK_LULUS",
  }));
  const totalMataPelajaran = rows.length;
  const rataRataNilai =
    totalMataPelajaran > 0
      ? rows.reduce((total, row) => total + row.nilaiAkhir, 0) /
        totalMataPelajaran
      : 0;
  const jumlahLulus = rows.filter(
    (row) => row.statusKelulusan === "LULUS"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-background p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LibraryBig className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">
              Nilai Saya
            </h1>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Daftar nilai pribadi dan status kelulusan untuk setiap mata
              pelajaran.
            </p>
          </div>
        </div>
        <div className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
          {siswa.nama} - {siswa.kelas}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-primary/10 shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Mata Pelajaran
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-normal">
                {totalMataPelajaran}
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpenCheck className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/10 shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Rata-rata Pribadi
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-normal">
                {formatNilai(rataRataNilai)}
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/10 shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm text-muted-foreground">Status Lulus</p>
              <p className="mt-2 text-3xl font-semibold tracking-normal">
                {jumlahLulus}/{totalMataPelajaran}
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/10 shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm text-muted-foreground">Kelas</p>
              <p className="mt-2 text-3xl font-semibold tracking-normal">
                {siswa.kelas}
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <GraduationCap className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Tabel Nilai Siswa</CardTitle>
          <CardDescription>
            Rincian nilai tugas, UTS, UAS, nilai akhir, dan status kelulusan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabelNilai data={rows} mode="siswa" />
        </CardContent>
      </Card>
    </div>
  );
}
