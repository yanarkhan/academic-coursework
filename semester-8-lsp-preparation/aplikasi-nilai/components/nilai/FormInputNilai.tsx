"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { Calculator, RefreshCw, Save } from "lucide-react";
import { inputNilaiAction } from "@/actions/nilaiActions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatNilai,
  hitungNilaiAkhir,
  tentukanStatusKelulusan,
  validasiRentangNilai,
} from "@/lib/utils/nilaiUtils";
import { BadgeStatus } from "@/components/nilai/BadgeStatus";

type SiswaOption = {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
};

type FormInputNilaiProps = {
  guruId: string;
  siswaOptions: SiswaOption[];
};

type PesanForm = {
  sukses: boolean;
  teks: string;
};

const initialForm = {
  siswaId: "",
  nilaiTugas: "",
  nilaiUTS: "",
  nilaiUAS: "",
};

export function FormInputNilai({ guruId, siswaOptions }: FormInputNilaiProps) {
  const [form, setForm] = useState(initialForm);
  const [pesan, setPesan] = useState<PesanForm | null>(null);
  const [isPending, startTransition] = useTransition();

  const preview = useMemo(() => {
    const nilaiTugas = Number(form.nilaiTugas);
    const nilaiUTS = Number(form.nilaiUTS);
    const nilaiUAS = Number(form.nilaiUAS);
    const semuaNilaiTerisi =
      form.nilaiTugas !== "" && form.nilaiUTS !== "" && form.nilaiUAS !== "";
    const semuaNilaiValid =
      semuaNilaiTerisi &&
      [nilaiTugas, nilaiUTS, nilaiUAS].every((nilai) =>
        validasiRentangNilai(nilai)
      );

    if (!semuaNilaiValid) return null;

    const nilaiAkhir = hitungNilaiAkhir(nilaiTugas, nilaiUTS, nilaiUAS);
    const statusKelulusan = tentukanStatusKelulusan(nilaiAkhir);

    return { nilaiAkhir, statusKelulusan };
  }, [form.nilaiTugas, form.nilaiUTS, form.nilaiUAS]);

  function updateField(field: keyof typeof initialForm, value: string): void {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    startTransition(async () => {
      const result = await inputNilaiAction({
        siswaId: form.siswaId,
        guruId,
        nilaiTugas: Number(form.nilaiTugas),
        nilaiUTS: Number(form.nilaiUTS),
        nilaiUAS: Number(form.nilaiUAS),
      });
      setPesan({ sukses: result.sukses, teks: result.pesan });

      if (result.sukses) {
        setForm(initialForm);
      }
    });
  }

  function resetForm(): void {
    setForm(initialForm);
    setPesan(null);
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-semibold tracking-normal">
                Form Penilaian
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pilih siswa dan masukkan tiga komponen nilai.
              </p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calculator className="size-5" />
            </div>
          </div>

          <div className="grid gap-4">
            <FormField>
              <FormItem className="space-y-2">
                <FormLabel>Siswa</FormLabel>
                <Select
                  value={form.siswaId}
                  onValueChange={(value) => updateField("siswaId", value)}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-xl bg-muted/20">
                      <SelectValue placeholder="Pilih siswa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {siswaOptions.map((siswa) => (
                      <SelectItem key={siswa.id} value={siswa.id}>
                        {siswa.nis} - {siswa.nama} ({siswa.kelas})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </FormField>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField>
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="nilaiTugas">Nilai Tugas</FormLabel>
                  <FormControl>
                    <Input
                      id="nilaiTugas"
                      type="number"
                      min={0}
                      max={100}
                      value={form.nilaiTugas}
                      onChange={(event) =>
                        updateField("nilaiTugas", event.target.value)
                      }
                      className="h-12 rounded-xl bg-muted/20 text-base font-semibold"
                      disabled={isPending}
                      required
                    />
                  </FormControl>
                </FormItem>
              </FormField>

              <FormField>
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="nilaiUTS">Nilai UTS</FormLabel>
                  <FormControl>
                    <Input
                      id="nilaiUTS"
                      type="number"
                      min={0}
                      max={100}
                      value={form.nilaiUTS}
                      onChange={(event) =>
                        updateField("nilaiUTS", event.target.value)
                      }
                      className="h-12 rounded-xl bg-muted/20 text-base font-semibold"
                      disabled={isPending}
                      required
                    />
                  </FormControl>
                </FormItem>
              </FormField>

              <FormField>
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="nilaiUAS">Nilai UAS</FormLabel>
                  <FormControl>
                    <Input
                      id="nilaiUAS"
                      type="number"
                      min={0}
                      max={100}
                      value={form.nilaiUAS}
                      onChange={(event) =>
                        updateField("nilaiUAS", event.target.value)
                      }
                      className="h-12 rounded-xl bg-muted/20 text-base font-semibold"
                      disabled={isPending}
                      required
                    />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={resetForm}
                disabled={isPending}
              >
                <RefreshCw className="size-4" />
                Bersihkan
              </Button>
              <Button
                type="submit"
                className="h-11 rounded-xl px-5 font-semibold shadow-lg shadow-primary/20"
                disabled={isPending || !form.siswaId}
              >
                <Save className="size-4" />
                {isPending ? "Menyimpan..." : "Simpan Nilai"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl border border-primary/15 bg-primary text-primary-foreground shadow-xl shadow-primary/20">
          <div className="flex items-center justify-between gap-4 p-6 pb-2">
            <p className="text-sm font-semibold text-primary-foreground/85">
              Preview Nilai Akhir
            </p>
            <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              Real-time
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6 text-center">
            <div className="flex size-36 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-inner">
              <div className="flex size-28 flex-col items-center justify-center rounded-full bg-background text-foreground shadow-lg">
                <span className="text-xs font-medium text-muted-foreground">
                  Nilai
                </span>
                <p className="text-4xl font-bold tracking-normal text-primary">
                  {preview ? formatNilai(preview.nilaiAkhir) : "0"}
                </p>
              </div>
            </div>

            <div className="mt-5">
              {preview ? (
                <BadgeStatus status={preview.statusKelulusan} />
              ) : (
                <p className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-primary-foreground/80">
                  Menunggu input
                </p>
              )}
            </div>

            <p className="mt-4 max-w-[240px] text-sm leading-6 text-primary-foreground/75">
              {preview
                ? "Bobot: Tugas 30%, UTS 30%, UAS 40%."
                : "Isi ketiga komponen nilai untuk melihat status kelulusan."}
            </p>
          </div>
        </div>
      </div>

      {pesan ? (
        <FormMessage
          className={
            pesan.sukses
              ? "rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-primary"
              : "rounded-xl border border-destructive/15 bg-destructive/5 px-3 py-2 text-destructive"
          }
        >
          {pesan.teks}
        </FormMessage>
      ) : null}
    </Form>
  );
}
