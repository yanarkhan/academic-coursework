# Implementasi Antarmuka dan Fitur

Dokumen ini membuktikan implementasi output 1, 2, 3, dan 4 pada aplikasi pengolahan nilai siswa. Bukti diambil dari potongan kode asli proyek.

## Output 1 - Halaman Login

Halaman login dibuat sebagai form autentikasi dengan komponen Shadcn UI. Form login menerima `username` dan `password`, lalu memanggil `loginAction` melalui `useActionState`.

Placeholder bukti visual:

```text
[Screenshot Login]
```

Potongan kode asli dari `components/auth/LoginForm.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/actions/authActions";

const initialLoginActionState = {
  sukses: false,
  pesan: "",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialLoginActionState
  );

  return (
    <Form action={formAction} className="space-y-5">
      <FormField>
        <FormItem className="space-y-2">
          <FormLabel htmlFor="username" className="text-sm font-medium">
            Username
          </FormLabel>
          <FormControl>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Masukkan username"
                className="h-12 rounded-xl border-border/80 bg-muted/20 pl-10 shadow-none transition-colors focus-visible:border-primary/60 focus-visible:ring-primary/20"
                disabled={isPending}
                required
              />
            </div>
          </FormControl>
        </FormItem>
      </FormField>
```

Penjelasan:

1. Form menggunakan komponen `Form`, `FormField`, `Input`, dan `Button`.
2. Input username dan password memiliki validasi `required`.
3. Submit form memanggil Server Action `loginAction`.
4. Saat proses login berjalan, tombol menampilkan status `Memproses...`.

## Output 2 - Form Input Data/Nilai

Form input nilai digunakan oleh Guru untuk memilih siswa dan memasukkan nilai Tugas, UTS, dan UAS. Komponen ini juga menampilkan preview nilai akhir secara real-time.

Placeholder bukti visual:

```text
[Screenshot Form Input Nilai]
```

Potongan kode asli dari `components/nilai/FormInputNilai.tsx`:

```tsx
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

export function FormInputNilai({ guruId, siswaOptions }: FormInputNilaiProps) {
  const [form, setForm] = useState(initialForm);
  const [pesan, setPesan] = useState<PesanForm | null>(null);
  const [isPending, startTransition] = useTransition();

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
```

Potongan UI input nilai:

```tsx
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
```

Penjelasan:

1. Guru memilih siswa dari dropdown.
2. Guru memasukkan nilai Tugas, UTS, dan UAS.
3. Data dikirim ke `inputNilaiAction`.
4. Form menampilkan pesan berhasil/gagal berdasarkan hasil Server Action.

## Output 3 - Proses Kalkulasi Nilai

Kalkulasi nilai dilakukan dengan fungsi utilitas terstruktur. Preview nilai akhir dihitung sebelum data disimpan, sedangkan penyimpanan final dilakukan melalui `NilaiService`.

Placeholder bukti visual:

```text
[Screenshot Preview Kalkulasi Nilai Akhir]
```

Potongan kode asli dari `components/nilai/FormInputNilai.tsx`:

```tsx
const preview = useMemo(() => {
  const nilaiTugas = Number(form.nilaiTugas);
  const nilaiUTS = Number(form.nilaiUTS);
  const nilaiUAS = Number(form.nilaiUAS);
  const semuaNilaiTerisi =
    form.nilaiTugas !== "" && form.nilaiUTS !== "" && form.nilaiUAS !== "";
  const semuaNilaiValid =
    semuaNilaiTerisi &&
    [nilaiTugas, nilaiUTS, nilaiUAS].every((nilai) =>
      validasiRentangNilai(nilai),
    );

  if (!semuaNilaiValid) return null;

  const nilaiAkhir = hitungNilaiAkhir(nilaiTugas, nilaiUTS, nilaiUAS);
  const statusKelulusan = tentukanStatusKelulusan(nilaiAkhir);

  return { nilaiAkhir, statusKelulusan };
}, [form.nilaiTugas, form.nilaiUTS, form.nilaiUAS]);
```

Potongan tampilan preview:

```tsx
<p className="text-4xl font-bold tracking-normal text-primary">
  {preview ? formatNilai(preview.nilaiAkhir) : "0"}
</p>

<div className="mt-5">
  {preview ? (
    <BadgeStatus status={preview.statusKelulusan} />
  ) : (
    <p className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-primary-foreground/80">
      Menunggu input
    </p>
  )}
</div>
```

Penjelasan:

1. `useMemo` digunakan agar kalkulasi preview efisien.
2. Nilai divalidasi dengan `validasiRentangNilai`.
3. Nilai akhir dihitung dengan `hitungNilaiAkhir`.
4. Status kelulusan dihitung dengan `tentukanStatusKelulusan`.

## Output 4 - Laporan Hasil

Laporan hasil nilai ditampilkan menggunakan tabel nilai. Tabel menampilkan siswa, kelas, mata pelajaran, guru, komponen nilai, nilai akhir, status, dan aksi sesuai hak akses.

Placeholder bukti visual:

```text
[Screenshot Laporan Hasil Nilai]
```

Potongan kode asli dari `components/nilai/TabelNilai.tsx`:

```tsx
export type NilaiRow = {
  id: string;
  siswaNama: string;
  siswaKelas: string;
  guruNama: string;
  mataPelajaran: string;
  nilaiTugas: number;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
  statusKelulusan: "LULUS" | "TIDAK_LULUS";
};

type TabelNilaiProps = {
  data: NilaiRow[];
  mode: "admin" | "guru" | "siswa";
};
```

Potongan tampilan laporan:

```tsx
<div className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm">
  <div className="overflow-x-auto">
    <Table className="min-w-245">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Siswa
          </TableHead>
          <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Nilai Akhir
          </TableHead>
          <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
```

Penjelasan:

1. Tabel dibuat responsif dengan `overflow-x-auto`.
2. Nilai akhir diformat menggunakan `formatNilai`.
3. Status kelulusan ditampilkan melalui `BadgeStatus`.
4. Mode tabel membedakan hak akses Admin, Guru, dan Siswa.
