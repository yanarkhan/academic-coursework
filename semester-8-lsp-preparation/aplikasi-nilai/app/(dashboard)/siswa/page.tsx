import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, BookOpenCheck, GraduationCap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { NilaiService } from "@/lib/services/NilaiService";
import { SiswaService } from "@/lib/services/SiswaService";
import { formatNilai } from "@/lib/utils/nilaiUtils";

export const metadata: Metadata = {
  title: "Dashboard Siswa | Sistem Pengolahan Nilai",
};

export default async function SiswaDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (session?.user?.role !== "SISWA" || !userId) {
    redirect("/login");
  }

  const siswaService = new SiswaService();
  const nilaiService = new NilaiService();
  const siswa = await siswaService.getSiswaByUserId(userId);

  if (!siswa) {
    redirect("/login");
  }

  const daftarNilai = await nilaiService.getNilaiBySiswa(siswa.id);
  const totalNilai = daftarNilai.length;
  const totalLulus = daftarNilai.filter(
    (nilai) => nilai.statusKelulusan === "LULUS"
  ).length;
  const rataRata =
    totalNilai > 0
      ? daftarNilai.reduce((total, nilai) => total + nilai.nilaiAkhir, 0) /
        totalNilai
      : 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            Dashboard Siswa
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Selamat datang, {siswa.nama}. Pantau ringkasan nilai akademik Anda.
          </p>
        </div>
        <Button asChild className="h-11 rounded-xl px-5 font-semibold shadow-sm">
          <Link href="/siswa/nilai-saya">
            <BookOpenCheck className="size-4" />
            Nilai Saya
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Rata-rata Semester Ini
              </p>
              <p className="mt-2 text-5xl font-semibold tracking-normal text-primary">
                {formatNilai(rataRata)}
              </p>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Mata Pelajaran</p>
              <p className="mt-2 text-4xl font-semibold tracking-normal">
                {totalNilai}
              </p>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <GraduationCap className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Status Lulus</p>
              <p className="mt-2 text-4xl font-semibold tracking-normal">
                {totalLulus}
              </p>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Award className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 rounded-xl border bg-white shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Ringkasan Akademik</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalNilai > 0
                ? `${totalLulus} dari ${totalNilai} mata pelajaran berstatus lulus.`
                : "Nilai belum tersedia."}
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-xl px-5">
            <Link href="/siswa/nilai-saya">Lihat Detail Nilai</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
