import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenCheck, Plus, UsersRound } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { TabelSiswa, type SiswaRow } from "@/components/siswa/TabelSiswa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { SiswaService } from "@/lib/services/SiswaService";

export const metadata: Metadata = {
  title: "Data Siswa | Sistem Pengolahan Nilai",
};

const PAGE_SIZE = 8;

type AdminSiswaPageProps = {
  searchParams: Promise<{ page?: string }>;
};

function parsePage(value: string | undefined): number {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export default async function AdminSiswaPage({
  searchParams,
}: AdminSiswaPageProps) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const params = await searchParams;
  const siswaService = new SiswaService();
  const daftarSiswa = await siswaService.getDaftarSiswa();
  const totalPages = Math.max(1, Math.ceil(daftarSiswa.length / PAGE_SIZE));
  const activePage = Math.min(parsePage(params.page), totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedSiswa = daftarSiswa.slice(startIndex, startIndex + PAGE_SIZE);
  const siswaRows: SiswaRow[] = paginatedSiswa.map((siswa) => ({
    id: siswa.id,
    nis: siswa.nis,
    nama: siswa.nama,
    kelas: siswa.kelas,
    username: siswa.user.username,
  }));
  const totalKelas = new Set(daftarSiswa.map((siswa) => siswa.kelas)).size;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            Manajemen Data Siswa
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kelola informasi data diri, akademik, dan akun login siswa.
          </p>
        </div>
        <Button asChild className="h-11 rounded-xl px-5 font-semibold shadow-sm">
          <Link href="/admin/siswa/tambah">
            <Plus className="size-4" />
            Tambah Siswa
          </Link>
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Siswa</p>
              <p className="mt-2 text-4xl font-semibold tracking-normal">
                {daftarSiswa.length}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Kelas Terdaftar</p>
              <p className="mt-2 text-4xl font-semibold tracking-normal">
                {totalKelas}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BookOpenCheck className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border bg-white p-4 shadow-sm">
        <CardContent className="p-0">
          <TabelSiswa data={siswaRows} />

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Menampilkan {paginatedSiswa.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + paginatedSiswa.length, daftarSiswa.length)}{" "}
              dari {daftarSiswa.length} siswa
            </p>
            <div className="flex justify-end">
              <AdminTablePagination
                basePath="/admin/siswa"
                currentPage={activePage}
                pageSize={PAGE_SIZE}
                totalItems={daftarSiswa.length}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
