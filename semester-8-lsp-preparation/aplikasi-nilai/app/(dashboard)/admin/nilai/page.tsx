import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { FilterNilai } from "@/components/nilai/FilterNilai";
import { TabelNilai, type NilaiRow } from "@/components/nilai/TabelNilai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { NilaiService } from "@/lib/services/NilaiService";

export const metadata: Metadata = {
  title: "Data Nilai | Sistem Pengolahan Nilai",
};

const PAGE_SIZE = 8;

type AdminNilaiPageProps = {
  searchParams: Promise<{ kelas?: string; mapel?: string; page?: string }>;
};

function parsePage(value: string | undefined): number {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export default async function AdminNilaiPage({
  searchParams,
}: AdminNilaiPageProps) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const params = await searchParams;
  const nilaiService = new NilaiService();
  const daftarNilai = await nilaiService.getSemuaNilai();
  const kelasFilter = params.kelas;
  const mapelFilter = params.mapel;
  const nilaiTersaring = daftarNilai.filter((nilai) => {
    const cocokKelas = kelasFilter ? nilai.siswa.kelas === kelasFilter : true;
    const cocokMapel = mapelFilter
      ? nilai.guru.mataPelajaran === mapelFilter
      : true;

    return cocokKelas && cocokMapel;
  });
  const totalPages = Math.max(1, Math.ceil(nilaiTersaring.length / PAGE_SIZE));
  const activePage = Math.min(parsePage(params.page), totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedNilai = nilaiTersaring.slice(startIndex, startIndex + PAGE_SIZE);
  const rataRataNilai =
    nilaiTersaring.length > 0
      ? nilaiTersaring.reduce((total, nilai) => total + nilai.nilaiAkhir, 0) /
        nilaiTersaring.length
      : 0;
  const daftarKelas = Array.from(
    new Set(daftarNilai.map((nilai) => nilai.siswa.kelas))
  ).sort();
  const daftarMapel = Array.from(
    new Set(daftarNilai.map((nilai) => nilai.guru.mataPelajaran))
  ).sort();
  const laporanParams = new URLSearchParams();

  if (kelasFilter) {
    laporanParams.set("kelas", kelasFilter);
  }

  if (mapelFilter) {
    laporanParams.set("mapel", mapelFilter);
  }

  const laporanHref = laporanParams.toString()
    ? `/admin/laporan?${laporanParams.toString()}`
    : "/admin/laporan";

  const rows: NilaiRow[] = paginatedNilai.map((nilai) => ({
    id: nilai.id,
    siswaNama: nilai.siswa.nama,
    siswaKelas: nilai.siswa.kelas,
    guruNama: nilai.guru.namaGuru,
    mataPelajaran: nilai.guru.mataPelajaran,
    nilaiTugas: nilai.nilaiTugas,
    nilaiUTS: nilai.nilaiUTS,
    nilaiUAS: nilai.nilaiUAS,
    nilaiAkhir: nilai.nilaiAkhir,
    statusKelulusan:
      nilai.statusKelulusan === "LULUS" ? "LULUS" : "TIDAK_LULUS",
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            Pantau Data Nilai
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor performa akademik siswa secara langsung.
          </p>
        </div>
        <Button asChild className="h-11 rounded-xl px-5 font-semibold">
          <Link href={laporanHref}>
            <Download className="size-4" />
            Unduh Laporan
          </Link>
        </Button>
      </div>

      <FilterNilai
        daftarKelas={daftarKelas}
        daftarMapel={daftarMapel}
        rataRataNilai={rataRataNilai}
      />

      <Card className="rounded-xl border bg-white p-4 shadow-sm">
        <CardContent className="p-0">
          <TabelNilai data={rows} mode="admin" />

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Menampilkan {rows.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + rows.length, nilaiTersaring.length)} dari{" "}
              {nilaiTersaring.length} data
            </p>
            <div className="flex justify-end">
              <AdminTablePagination
                basePath="/admin/nilai"
                currentPage={activePage}
                pageSize={PAGE_SIZE}
                queryParams={{ kelas: kelasFilter, mapel: mapelFilter }}
                totalItems={nilaiTersaring.length}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
