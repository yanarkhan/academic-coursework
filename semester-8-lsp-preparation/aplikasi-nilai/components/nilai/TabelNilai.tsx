"use client";

import { useState, useTransition } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { hapusNilaiAction, updateNilaiAction } from "@/actions/nilaiActions";
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
import { formatNilai } from "@/lib/utils/nilaiUtils";
import { BadgeStatus } from "@/components/nilai/BadgeStatus";

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

type DraftNilai = Pick<NilaiRow, "nilaiTugas" | "nilaiUTS" | "nilaiUAS">;

type PesanTabel = {
  sukses: boolean;
  teks: string;
};

export function TabelNilai({ data, mode }: TabelNilaiProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftNilai | null>(null);
  const [pesan, setPesan] = useState<PesanTabel | null>(null);
  const [isPending, startTransition] = useTransition();
  const canEdit = mode === "guru";
  const canDelete = mode === "guru" || mode === "admin";

  function mulaiEdit(row: NilaiRow): void {
    setEditingId(row.id);
    setDraft({
      nilaiTugas: row.nilaiTugas,
      nilaiUTS: row.nilaiUTS,
      nilaiUAS: row.nilaiUAS,
    });
    setPesan(null);
  }

  function batalEdit(): void {
    setEditingId(null);
    setDraft(null);
  }

  function updateDraft(field: keyof DraftNilai, value: string): void {
    setDraft((current) =>
      current ? { ...current, [field]: Number(value) } : current
    );
  }

  function simpanEdit(id: string): void {
    if (!draft) return;

    startTransition(async () => {
      const result = await updateNilaiAction({
        id,
        nilaiTugas: draft.nilaiTugas,
        nilaiUTS: draft.nilaiUTS,
        nilaiUAS: draft.nilaiUAS,
      });
      setPesan({ sukses: result.sukses, teks: result.pesan });

      if (result.sukses) {
        batalEdit();
      }
    });
  }

  function hapus(id: string): void {
    startTransition(async () => {
      const result = await hapusNilaiAction(id);
      setPesan({ sukses: result.sukses, teks: result.pesan });
    });
  }

  const colSpan = canEdit || canDelete ? 10 : 9;

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

      <div className="overflow-hidden rounded-lg border border-slate-100 bg-white">
        <div className="overflow-x-auto">
        <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Siswa
              </TableHead>
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Kelas
              </TableHead>
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Mata Pelajaran
              </TableHead>
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Guru
              </TableHead>
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Tugas
              </TableHead>
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                UTS
              </TableHead>
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                UAS
              </TableHead>
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Nilai Akhir
              </TableHead>
              <TableHead className="h-12 whitespace-nowrap text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                Status
              </TableHead>
              {canEdit || canDelete ? (
                <TableHead className="h-12 w-[150px] whitespace-nowrap text-right text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                  Aksi
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  Data nilai belum tersedia.
                </TableCell>
              </TableRow>
            ) : null}

            {data.map((row) => {
              const isEditing = editingId === row.id && draft;

              return (
                <TableRow key={row.id} className="h-14 hover:bg-primary/5">
                  <TableCell className="whitespace-nowrap font-medium">
                    {row.siswaNama}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {row.siswaKelas}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {row.mataPelajaran}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {row.guruNama}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">
                    {isEditing ? (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={draft.nilaiTugas}
                        className="h-9 w-20 rounded-lg"
                        onChange={(event) =>
                          updateDraft("nilaiTugas", event.target.value)
                        }
                      />
                    ) : (
                      formatNilai(row.nilaiTugas)
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">
                    {isEditing ? (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={draft.nilaiUTS}
                        className="h-9 w-20 rounded-lg"
                        onChange={(event) =>
                          updateDraft("nilaiUTS", event.target.value)
                        }
                      />
                    ) : (
                      formatNilai(row.nilaiUTS)
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">
                    {isEditing ? (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={draft.nilaiUAS}
                        className="h-9 w-20 rounded-lg"
                        onChange={(event) =>
                          updateDraft("nilaiUAS", event.target.value)
                        }
                      />
                    ) : (
                      formatNilai(row.nilaiUAS)
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-semibold tabular-nums text-primary">
                    {formatNilai(row.nilaiAkhir)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <BadgeStatus status={row.statusKelulusan} />
                  </TableCell>
                  {canEdit || canDelete ? (
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="rounded-lg"
                            onClick={() => simpanEdit(row.id)}
                            disabled={isPending}
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={batalEdit}
                            disabled={isPending}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {canEdit ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg"
                              onClick={() => mulaiEdit(row)}
                              disabled={isPending}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          ) : null}
                          {canDelete ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="rounded-lg"
                                  disabled={isPending}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Hapus data nilai?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Entri nilai ini akan dihapus dari sistem.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => hapus(row.id)}
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : null}
                        </div>
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
