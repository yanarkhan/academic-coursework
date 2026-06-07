import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { TabelNilai, type NilaiRow } from "@/components/nilai/TabelNilai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { GuruService } from "@/lib/services/GuruService";
import { NilaiService } from "@/lib/services/NilaiService";

export const metadata: Metadata = {
  title: "Rekap Nilai Guru | Sistem Pengolahan Nilai",
};

type GuruRekapNilaiPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function GuruRekapNilaiPage({
  searchParams,
}: GuruRekapNilaiPageProps) {
  const session = await auth();

  if (session?.user?.role !== "GURU") {
    redirect("/login");
  }

  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const guruService = new GuruService();
  const nilaiService = new NilaiService();
  const guru = await guruService.getGuruByUserId(session.user.id);

  if (!guru) {
    redirect("/login");
  }

  const daftarNilai = await nilaiService.getNilaiByGuru(guru.id);
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
  const filteredRows = query
    ? rows.filter((row) =>
        [
          row.siswaNama,
          row.siswaKelas,
          row.mataPelajaran,
          row.guruNama,
          row.statusKelulusan,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    : rows;

  return (
    <div className="space-y-6">
      <section>
        <div>
          <p className="text-sm font-medium text-primary">
            Dashboard / Rekap Nilai
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Rekap Nilai Siswa
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Kelola dan pantau hasil nilai siswa untuk mata pelajaran{" "}
            {guru.mataPelajaran}.
          </p>
        </div>
      </section>

      <Card className="rounded-2xl border-primary/10 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-1">
            <CardTitle>Data Nilai</CardTitle>
            <CardDescription>
              Menampilkan {filteredRows.length} dari {rows.length} data nilai.
            </CardDescription>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" action="/guru/rekap-nilai">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Cari nama siswa, kelas, status, atau mata pelajaran"
                className="h-12 rounded-xl bg-muted/20 pl-10"
              />
            </div>
            <Button type="submit" className="h-12 rounded-xl px-5">
              Cari
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <TabelNilai data={filteredRows} mode="guru" />
        </CardContent>
      </Card>
    </div>
  );
}
