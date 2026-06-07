import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FormGuru } from "@/components/guru/FormGuru";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Tambah Guru | Sistem Pengolahan Nilai",
};

export default async function TambahGuruPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4 rounded-xl px-0">
          <Link href="/admin/guru">
            <ArrowLeft className="size-4" />
            Kembali ke Data Guru
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-normal">
          Tambah Guru
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lengkapi identitas guru, mata pelajaran, dan akun login.
        </p>
      </div>

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Form Tambah Guru</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <FormGuru />
        </CardContent>
      </Card>
    </div>
  );
}
