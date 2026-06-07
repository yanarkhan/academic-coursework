import type { Metadata } from "next";
import { BookOpenCheck, ClipboardList } from "lucide-react";
import { redirect } from "next/navigation";
import { FormInputNilai } from "@/components/nilai/FormInputNilai";
import { TabelNilai, type NilaiRow } from "@/components/nilai/TabelNilai";
import { Badge } from "@/components/ui/badge";
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
import { SiswaService } from "@/lib/services/SiswaService";

export const metadata: Metadata = {
  title: "Input Nilai Siswa | Sistem Pengolahan Nilai",
};

export default async function GuruInputNilaiPage() {
  const session = await auth();

  if (session?.user?.role !== "GURU") {
    redirect("/login");
  }

  const guruService = new GuruService();
  const siswaService = new SiswaService();
  const nilaiService = new NilaiService();
  const guru = await guruService.getGuruByUserId(session.user.id);

  if (!guru) {
    redirect("/login");
  }

  const [daftarSiswa, daftarNilai] = await Promise.all([
    siswaService.getDaftarSiswa(),
    nilaiService.getNilaiByGuru(guru.id),
  ]);
  const siswaOptions = daftarSiswa.map((siswa) => ({
    id: siswa.id,
    nis: siswa.nis,
    nama: siswa.nama,
    kelas: siswa.kelas,
  }));
  const rows: NilaiRow[] = daftarNilai.map((nilai) => ({
    id: nilai.id,
    siswaNama: nilai.siswa.nama,
    siswaKelas: nilai.siswa.kelas,
    guruNama: guru.namaGuru,
    mataPelajaran: guru.mataPelajaran,
    nilaiTugas: nilai.nilaiTugas,
    nilaiUTS: nilai.nilaiUTS,
    nilaiUAS: nilai.nilaiUAS,
    nilaiAkhir: nilai.nilaiAkhir,
    statusKelulusan:
      nilai.statusKelulusan === "LULUS" ? "LULUS" : "TIDAK_LULUS",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-background p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpenCheck className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">
              Input Nilai Siswa
            </h1>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Input nilai siswa untuk mata pelajaran {guru.mataPelajaran}.
            </p>
          </div>
        </div>
        <Badge className="w-fit rounded-full bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/10">
          {guru.mataPelajaran}
        </Badge>
      </div>

      <FormInputNilai guruId={guru.id} siswaOptions={siswaOptions} />

      <Card className="rounded-2xl border-primary/10 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Nilai yang Sudah Diinput</CardTitle>
            <CardDescription>
              Rekap data nilai dari siswa yang sudah dinilai.
            </CardDescription>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardList className="size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <TabelNilai data={rows} mode="guru" />
        </CardContent>
      </Card>
    </div>
  );
}
