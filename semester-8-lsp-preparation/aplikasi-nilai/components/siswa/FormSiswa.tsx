"use client";

import { FormEvent, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { tambahSiswaAction } from "@/actions/siswaActions";
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

type PesanForm = {
  sukses: boolean;
  teks: string;
};

const initialForm = {
  nis: "",
  nama: "",
  kelas: "",
  username: "",
  password: "",
};

export function FormSiswa() {
  const [form, setForm] = useState(initialForm);
  const [pesan, setPesan] = useState<PesanForm | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof typeof initialForm, value: string): void {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    startTransition(async () => {
      const result = await tambahSiswaAction(form);
      setPesan({ sukses: result.sukses, teks: result.pesan });

      if (result.sukses) {
        setForm(initialForm);
      }
    });
  }

  return (
    <Form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <FormField>
        <FormItem>
          <FormLabel htmlFor="nis">NIS</FormLabel>
          <FormControl>
            <Input
              id="nis"
              value={form.nis}
              onChange={(event) => updateField("nis", event.target.value)}
              placeholder="2024001"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField className="md:col-span-2">
        <FormItem>
          <FormLabel htmlFor="nama">Nama Siswa</FormLabel>
          <FormControl>
            <Input
              id="nama"
              value={form.nama}
              onChange={(event) => updateField("nama", event.target.value)}
              placeholder="Nama lengkap siswa"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel htmlFor="kelas">Kelas</FormLabel>
          <FormControl>
            <Input
              id="kelas"
              value={form.kelas}
              onChange={(event) => updateField("kelas", event.target.value)}
              placeholder="X-A"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel htmlFor="username-siswa">Username</FormLabel>
          <FormControl>
            <Input
              id="username-siswa"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              placeholder="siswa_011"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel htmlFor="password-siswa">Password</FormLabel>
          <FormControl>
            <Input
              id="password-siswa"
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Minimal 6 karakter"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <div className="flex items-end md:col-span-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-xl px-5 font-semibold"
        >
          <Plus className="size-4" />
          {isPending ? "Menyimpan..." : "Tambah Siswa"}
        </Button>
      </div>

      {pesan ? (
        <FormMessage
          className={
            pesan.sukses
              ? "md:col-span-2 text-green-700"
              : "md:col-span-2 text-destructive"
          }
        >
          {pesan.teks}
        </FormMessage>
      ) : null}
    </Form>
  );
}
