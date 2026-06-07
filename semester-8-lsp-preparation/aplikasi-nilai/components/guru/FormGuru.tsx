"use client";

import { FormEvent, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { tambahGuruAction } from "@/actions/guruActions";
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
  idGuru: "",
  namaGuru: "",
  mataPelajaran: "",
  username: "",
  password: "",
};

export function FormGuru() {
  const [form, setForm] = useState(initialForm);
  const [pesan, setPesan] = useState<PesanForm | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof typeof initialForm, value: string): void {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    startTransition(async () => {
      const result = await tambahGuruAction(form);
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
          <FormLabel htmlFor="idGuru">ID Guru</FormLabel>
          <FormControl>
            <Input
              id="idGuru"
              value={form.idGuru}
              onChange={(event) => updateField("idGuru", event.target.value)}
              placeholder="G004"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField className="md:col-span-2">
        <FormItem>
          <FormLabel htmlFor="namaGuru">Nama Guru</FormLabel>
          <FormControl>
            <Input
              id="namaGuru"
              value={form.namaGuru}
              onChange={(event) => updateField("namaGuru", event.target.value)}
              placeholder="Nama lengkap guru"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel htmlFor="mataPelajaran">Mata Pelajaran</FormLabel>
          <FormControl>
            <Input
              id="mataPelajaran"
              value={form.mataPelajaran}
              onChange={(event) =>
                updateField("mataPelajaran", event.target.value)
              }
              placeholder="Matematika"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel htmlFor="username-guru">Username</FormLabel>
          <FormControl>
            <Input
              id="username-guru"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              placeholder="guru_mapel"
              disabled={isPending}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField>
        <FormItem>
          <FormLabel htmlFor="password-guru">Password</FormLabel>
          <FormControl>
            <Input
              id="password-guru"
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
          {isPending ? "Menyimpan..." : "Tambah Guru"}
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
