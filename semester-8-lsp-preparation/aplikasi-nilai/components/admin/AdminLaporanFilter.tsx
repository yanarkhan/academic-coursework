"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdminLaporanFilterProps = {
  daftarKelas: string[];
  daftarMapel: string[];
};

export function AdminLaporanFilter({
  daftarKelas,
  daftarMapel,
}: AdminLaporanFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") ?? "semua";
  const mapel = searchParams.get("mapel") ?? "semua";

  function updateFilter(key: "kelas" | "mapel", value: string): void {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "semua") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `/admin/laporan?${query}` : "/admin/laporan");
  }

  return (
    <Card className="rounded-xl border bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Pilih Kelas
            </label>
            <Select
              value={kelas}
              onValueChange={(value) => updateFilter("kelas", value)}
            >
              <SelectTrigger className="h-12 w-full rounded-lg bg-slate-50 px-4 text-sm">
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kelas</SelectItem>
                {daftarKelas.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Pilih Mata Pelajaran
            </label>
            <Select
              value={mapel}
              onValueChange={(value) => updateFilter("mapel", value)}
            >
              <SelectTrigger className="h-12 w-full rounded-lg bg-slate-50 px-4 text-sm">
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Mata Pelajaran</SelectItem>
                {daftarMapel.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-5 font-semibold"
            onClick={() => router.push("/admin/laporan")}
          >
            <RotateCcw className="size-4" />
            Reset Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
