import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard | Sistem Pengolahan Nilai",
};

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();

  if (!session?.user?.id || !session.user.role) {
    redirect("/login");
  }

  return (
    <DashboardShell
      namaPengguna={session.user.name ?? "Pengguna"}
      role={session.user.role}
    >
      {children}
    </DashboardShell>
  );
}
