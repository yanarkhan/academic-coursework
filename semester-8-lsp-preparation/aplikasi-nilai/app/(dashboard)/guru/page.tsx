import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { BadgeStatus } from "@/components/nilai/BadgeStatus";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { GuruService } from "@/lib/services/GuruService";
import { NilaiService } from "@/lib/services/NilaiService";
import { formatNilai } from "@/lib/utils/nilaiUtils";

export const metadata: Metadata = {
  title: "Dashboard Guru | Sistem Pengolahan Nilai",
};

export default async function GuruDashboardPage() {
  const session = await auth();

  if (session?.user?.role !== "GURU") {
    redirect("/login");
  }

  const guruService = new GuruService();
  const nilaiService = new NilaiService();
  const guru = await guruService.getGuruByUserId(session.user.id);

  if (!guru) {
    redirect("/login");
  }

  const daftarNilai = await nilaiService.getNilaiByGuru(guru.id);
  const totalNilai = daftarNilai.length;
  const totalSiswaDinilai = new Set(
    daftarNilai.map((nilai) => nilai.siswa.id)
  ).size;
  const rataRataNilai =
    totalNilai > 0
      ? daftarNilai.reduce((total, nilai) => total + nilai.nilaiAkhir, 0) /
        totalNilai
      : 0;
  const aktivitasTerakhir = daftarNilai.slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Dashboard Guru</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Selamat Datang, {guru.namaGuru}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Pantau ringkasan nilai untuk mata pelajaran {guru.mataPelajaran}.
          </p>
        </div>
        <Button asChild className="h-11 rounded-xl shadow-lg shadow-primary/20">
          <Link href="/guru/input-nilai">
            <BookOpenCheck className="size-4" />
            Input Nilai
          </Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-primary/10 shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Nilai Diinput
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-normal">
                {totalNilai}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ClipboardList className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/10 shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Rata-rata Nilai
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-normal">
                {formatNilai(rataRataNilai)}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/10 shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Siswa Dinilai
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-normal">
                {totalSiswaDinilai}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <GraduationCap className="size-6" />
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl border-primary/10 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Aktivitas Terakhir</CardTitle>
            <CardDescription>
              Nilai terbaru yang tersimpan untuk mata pelajaran Anda.
            </CardDescription>
          </div>
          <Button asChild variant="outline" className="h-10 rounded-xl">
            <Link href="/guru/rekap-nilai">Lihat Rekap</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {aktivitasTerakhir.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Belum ada nilai yang diinput.
            </div>
          ) : (
            <div className="divide-y">
              {aktivitasTerakhir.map((nilai) => (
                <div
                  key={nilai.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {nilai.siswa.nama.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {nilai.siswa.nama}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {guru.mataPelajaran} - {nilai.siswa.kelas}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <p className="text-lg font-semibold tabular-nums text-primary">
                      {formatNilai(nilai.nilaiAkhir)}
                    </p>
                    <BadgeStatus
                      status={
                        nilai.statusKelulusan === "LULUS"
                          ? "LULUS"
                          : "TIDAK_LULUS"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
