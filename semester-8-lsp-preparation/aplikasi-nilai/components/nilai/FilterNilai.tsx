"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNilai } from "@/lib/utils/nilaiUtils";

type FilterNilaiProps = {
  daftarKelas: string[];
  daftarMapel: string[];
  rataRataNilai: number;
};

export function FilterNilai({
  daftarKelas,
  daftarMapel,
  rataRataNilai,
}: FilterNilaiProps) {
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

    params.delete("page");
    const query = params.toString();
    router.push(query ? `/admin/nilai?${query}` : "/admin/nilai");
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="rounded-xl border bg-white shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Pilih Kelas
          </p>
          <Select value={kelas} onValueChange={(value) => updateFilter("kelas", value)}>
            <SelectTrigger className="mt-3 h-12 w-full rounded-lg bg-slate-50 px-4 text-sm">
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
        </CardContent>
      </Card>

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Mata Pelajaran
          </p>
          <Select value={mapel} onValueChange={(value) => updateFilter("mapel", value)}>
            <SelectTrigger className="mt-3 h-12 w-full rounded-lg bg-slate-50 px-4 text-sm">
              <SelectValue placeholder="Pilih mata pelajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Pelajaran</SelectItem>
              {daftarMapel.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              Rata-rata Nilai
            </p>
            <p className="mt-2 text-3xl font-semibold text-primary">
              {formatNilai(rataRataNilai)}
            </p>
          </div>
          <TrendingUp className="size-6 text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
