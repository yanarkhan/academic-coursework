"use client";

import { useState, useTransition } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { hapusSiswaAction, updateSiswaAction } from "@/actions/siswaActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type SiswaRow = {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  username: string;
};

type TabelSiswaProps = {
  data: SiswaRow[];
};

type DraftSiswa = Omit<SiswaRow, "id"> & {
  password: string;
};

type PesanTabel = {
  sukses: boolean;
  teks: string;
};

export function TabelSiswa({ data }: TabelSiswaProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftSiswa | null>(null);
  const [pesan, setPesan] = useState<PesanTabel | null>(null);
  const [isPending, startTransition] = useTransition();

  function mulaiEdit(row: SiswaRow): void {
    setEditingId(row.id);
    setDraft({ ...row, password: "" });
    setPesan(null);
  }

  function batalEdit(): void {
    setEditingId(null);
    setDraft(null);
  }

  function updateDraft(field: keyof DraftSiswa, value: string): void {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  }

  function simpanEdit(id: string): void {
    if (!draft) return;

    startTransition(async () => {
      const result = await updateSiswaAction({
        id,
        nis: draft.nis,
        nama: draft.nama,
        kelas: draft.kelas,
        username: draft.username,
        password: draft.password.trim() ? draft.password : undefined,
      });
      setPesan({ sukses: result.sukses, teks: result.pesan });

      if (result.sukses) {
        batalEdit();
      }
    });
  }

  function hapus(id: string): void {
    startTransition(async () => {
      const result = await hapusSiswaAction(id);
      setPesan({ sukses: result.sukses, teks: result.pesan });
    });
  }

  return (
    <div className="space-y-3">
      {pesan ? (
        <p
          className={
            pesan.sukses
              ? "text-sm font-medium text-green-700"
              : "text-sm font-medium text-destructive"
          }
        >
          {pesan.teks}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="h-12 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                NIS
              </TableHead>
              <TableHead className="h-12 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Nama Lengkap
              </TableHead>
              <TableHead className="h-12 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Kelas
              </TableHead>
              <TableHead className="h-12 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Username
              </TableHead>
              <TableHead className="h-12 w-[180px] text-right text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Data siswa belum tersedia.
                </TableCell>
              </TableRow>
            ) : null}

            {data.map((row) => {
              const isEditing = editingId === row.id && draft;

              return (
                <TableRow key={row.id} className="h-16 hover:bg-primary/5">
                  <TableCell className="font-medium tabular-nums">
                    {isEditing ? (
                      <Input
                        value={draft.nis}
                        onChange={(event) => updateDraft("nis", event.target.value)}
                      />
                    ) : (
                      row.nis
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {isEditing ? (
                      <Input
                        value={draft.nama}
                        onChange={(event) => updateDraft("nama", event.target.value)}
                      />
                    ) : (
                      row.nama
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {isEditing ? (
                      <Input
                        value={draft.kelas}
                        onChange={(event) => updateDraft("kelas", event.target.value)}
                      />
                    ) : (
                      row.kelas
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {isEditing ? (
                      <div className="grid gap-2">
                        <Input
                          value={draft.username}
                          onChange={(event) =>
                            updateDraft("username", event.target.value)
                          }
                        />
                        <Input
                          type="password"
                          value={draft.password}
                          onChange={(event) =>
                            updateDraft("password", event.target.value)
                          }
                          placeholder="Password baru opsional"
                        />
                      </div>
                    ) : (
                      row.username
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => simpanEdit(row.id)}
                          disabled={isPending}
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={batalEdit}
                          disabled={isPending}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => mulaiEdit(row)}
                          disabled={isPending}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isPending}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Hapus data siswa?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Data siswa dan akun login terkait akan dihapus dari
                                sistem.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => hapus(row.id)}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
