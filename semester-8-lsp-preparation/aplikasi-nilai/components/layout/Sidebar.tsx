"use client";

import type { Role } from "@prisma/client";
import {
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: Role;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

export const menuByRole = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/siswa", label: "Data Siswa", icon: GraduationCap },
    { href: "/admin/guru", label: "Data Guru", icon: UsersRound },
    { href: "/admin/nilai", label: "Data Nilai", icon: ClipboardList },
    { href: "/admin/laporan", label: "Laporan", icon: BarChart3 },
  ],
  GURU: [
    { href: "/guru", label: "Dashboard", icon: LayoutDashboard },
    { href: "/guru/input-nilai", label: "Input Nilai", icon: BookOpenCheck },
    { href: "/guru/rekap-nilai", label: "Rekap Nilai", icon: ClipboardList },
  ],
  SISWA: [
    { href: "/siswa", label: "Dashboard", icon: LayoutDashboard },
    { href: "/siswa/nilai-saya", label: "Nilai Saya", icon: LibraryBig },
  ],
} satisfies Record<Role, Array<{ href: string; label: string; icon: typeof LayoutDashboard }>>;

function getRoleLabel(role: Role): string {
  if (role === "ADMIN") return "Admin";
  if (role === "GURU") return "Guru";
  return "Siswa";
}

function isMenuActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/admin" || href === "/guru" || href === "/siswa") return false;
  return pathname.startsWith(`${href}/`);
}

export function Sidebar({
  role,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const menuItems = menuByRole[role];
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-primary/10 bg-background/95 shadow-[18px_0_60px_rgba(15,118,110,0.12)] backdrop-blur transition-transform duration-300 ease-in-out md:sticky md:top-0 md:z-30 md:h-screen md:w-72 md:translate-x-0 md:overflow-y-auto md:shadow-[18px_0_60px_rgba(15,118,110,0.06)]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-between gap-3 px-5 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 md:size-12">
              <BookOpenCheck className="size-5 md:size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold tracking-normal">
                EduGrade
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Sistem Pengolahan Nilai
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary md:hidden"
            aria-label="Tutup menu navigasi"
            onClick={onMobileClose}
          >
            <X className="size-5" />
          </Button>
        </div>

        <Separator className="bg-primary/10" />

        <div className="px-5 py-5 md:px-6">
          <Badge
            variant="secondary"
            className="gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-primary"
          >
            <UserRound className="size-3.5" />
            {getRoleLabel(role)}
          </Badge>
        </div>

        <nav className="grid gap-1.5 px-3 md:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isMenuActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "group relative flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary",
                  active &&
                    "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-transparent transition-colors",
                    active && "bg-primary"
                  )}
                />
                <Icon
                  className={cn(
                    "size-4 transition-colors group-hover:text-primary",
                    active && "text-primary"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-5 pb-6 md:px-6">
          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-primary">UJIKOM LSP</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Kelola nilai siswa dengan akses sesuai peran pengguna.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
