import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FormSiswa } from "@/components/siswa/FormSiswa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Tambah Siswa | Sistem Pengolahan Nilai",
};

export default async function TambahSiswaPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4 rounded-xl px-0">
          <Link href="/admin/siswa">
            <ArrowLeft className="size-4" />
            Kembali ke Data Siswa
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-normal">
          Tambah Siswa
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lengkapi data siswa dan akun login yang akan digunakan.
        </p>
      </div>

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Form Tambah Siswa</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <FormSiswa />
        </CardContent>
      </Card>
    </div>
  );
}
