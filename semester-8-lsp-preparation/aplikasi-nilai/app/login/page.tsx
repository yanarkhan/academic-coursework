import type { Metadata } from "next";
import { BookOpenCheck, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login | Sistem Pengolahan Nilai",
};

function getDashboardPath(role: string): string {
  if (role === "ADMIN") return "/admin";
  if (role === "GURU") return "/guru";
  return "/siswa";
}

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.role) {
    redirect(getDashboardPath(session.user.role));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3faf8] px-4 py-10 sm:px-6">
      <div className="w-full max-w-115">
        <Card className="overflow-hidden rounded-2xl border-primary/10 bg-background shadow-[0_24px_80px_rgba(15,118,110,0.14)]">
          <CardHeader className="space-y-6 px-7 pt-10 text-center sm:px-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <BookOpenCheck className="size-8" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-normal text-foreground">
                Masuk ke Sistem
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                Gunakan akun yang sudah terdaftar untuk mengakses portal nilai
                sesuai peran Anda.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-8 sm:px-10">
            <LoginForm />
          </CardContent>
        </Card>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          <span>Sistem internal UJIKOM LSP Programmer</span>
        </div>
      </div>
    </main>
  );
}
