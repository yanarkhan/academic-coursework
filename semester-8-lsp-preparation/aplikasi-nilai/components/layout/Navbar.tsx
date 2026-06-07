"use client";

import type { Role } from "@prisma/client";
import { LogOut, Menu } from "lucide-react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { logoutAction } from "@/actions/authActions";
import { Button } from "@/components/ui/button";

type NavbarProps = {
  namaPengguna: string;
  role: Role;
  onMobileMenuOpen: () => void;
};

function getRoleLabel(role: Role): string {
  if (role === "ADMIN") return "Admin";
  if (role === "GURU") return "Guru";
  return "Siswa";
}

function getInitials(namaPengguna: string): string {
  const words = namaPengguna.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]).join("");
  return initials.toUpperCase() || "PG";
}

export function Navbar({ namaPengguna, role, onMobileMenuOpen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-primary/10 bg-background/95 backdrop-blur-xl">
      <div className="flex h-20 min-h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary md:hidden"
          aria-label="Buka menu navigasi"
          onClick={onMobileMenuOpen}
        >
          <Menu className="size-5" />
        </Button>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-2 md:gap-4">
          <div className="hidden h-8 w-px bg-border md:block" />
          <AvatarPrimitive.Root className="flex size-11 shrink-0 select-none items-center justify-center overflow-hidden rounded-full border-2 border-primary/15 bg-primary/10 text-primary shadow-sm">
            <AvatarPrimitive.Fallback className="flex size-full items-center justify-center rounded-full text-sm font-semibold">
              {getInitials(namaPengguna)}
            </AvatarPrimitive.Fallback>
          </AvatarPrimitive.Root>

          <div className="hidden min-w-0 flex-col text-right md:flex">
            <p className="truncate text-sm font-semibold leading-5 text-foreground">
              {namaPengguna}
            </p>
            <p className="truncate text-xs font-medium leading-4 text-muted-foreground">
              {getRoleLabel(role)}
            </p>
          </div>

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="size-10 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
              aria-label="Keluar"
            >
              <LogOut className="size-5" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
