"use client";

import type { Role } from "@prisma/client";
import type { ReactNode } from "react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

type DashboardShellProps = {
  children: ReactNode;
  namaPengguna: string;
  role: Role;
};

export function DashboardShell({
  children,
  namaPengguna,
  role,
}: DashboardShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6fbfa] md:flex">
      {isMobileSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Tutup menu navigasi"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      ) : null}

      <Sidebar
        role={role}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="min-h-screen min-w-0 flex-1">
        <Navbar
          namaPengguna={namaPengguna}
          role={role}
          onMobileMenuOpen={() => setIsMobileSidebarOpen(true)}
        />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
