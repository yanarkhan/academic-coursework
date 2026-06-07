import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HelpCircle, Info, LockKeyhole, Plus } from "lucide-react";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { TabelGuru, type GuruRow } from "@/components/guru/TabelGuru";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { GuruService } from "@/lib/services/GuruService";

export const metadata: Metadata = {
  title: "Data Guru | Sistem Pengolahan Nilai",
};

const PAGE_SIZE = 8;

type AdminGuruPageProps = {
  searchParams: Promise<{ page?: string }>;
};

function parsePage(value: string | undefined): number {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export default async function AdminGuruPage({
  searchParams,
}: AdminGuruPageProps) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const params = await searchParams;
  const guruService = new GuruService();
  const daftarGuru = await guruService.getDaftarGuru();
  const totalPages = Math.max(1, Math.ceil(daftarGuru.length / PAGE_SIZE));
  const activePage = Math.min(parsePage(params.page), totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedGuru = daftarGuru.slice(startIndex, startIndex + PAGE_SIZE);
  const guruRows: GuruRow[] = paginatedGuru.map((guru) => ({
    id: guru.id,
    idGuru: guru.idGuru,
    namaGuru: guru.namaGuru,
    mataPelajaran: guru.mataPelajaran,
    username: guru.user.username,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            Manajemen Data Guru
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kelola informasi tenaga pendidik dan penugasan mata pelajaran.
          </p>
        </div>
        <Button asChild className="h-11 rounded-xl px-5 font-semibold shadow-sm">
          <Link href="/admin/guru/tambah">
            <Plus className="size-4" />
            Tambah Guru
          </Link>
        </Button>
      </div>

      <Card className="rounded-xl border bg-white p-4 shadow-sm">
        <CardContent className="p-0">
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Menampilkan {paginatedGuru.length} dari {daftarGuru.length} entri
            </p>
          </div>

          <TabelGuru data={guruRows} />

          <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
            <AdminTablePagination
              basePath="/admin/guru"
              currentPage={activePage}
              pageSize={PAGE_SIZE}
              totalItems={daftarGuru.length}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="flex gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Info className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Informasi ID Guru</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Gunakan ID guru yang konsisten agar data mudah dilacak.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="flex gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LockKeyhole className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Akses Login</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Akun guru dibuat otomatis saat data guru ditambahkan.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="flex gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Butuh Bantuan?</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Periksa ID Guru dan username jika terjadi duplikasi data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
