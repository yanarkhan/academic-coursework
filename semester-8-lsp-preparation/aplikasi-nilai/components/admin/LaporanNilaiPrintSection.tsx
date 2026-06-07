"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { BadgeStatus } from "@/components/nilai/BadgeStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNilai } from "@/lib/utils/nilaiUtils";

export type LaporanNilaiRow = {
  id: string;
  siswa: string;
  kelas: string;
  mataPelajaran: string;
  guru: string;
  tugas: number;
  uts: number;
  uas: number;
  nilaiAkhir: number;
  status: "LULUS" | "TIDAK_LULUS";
};

type LaporanNilaiPrintSectionProps = {
  data: LaporanNilaiRow[];
};

export function LaporanNilaiPrintSection({
  data,
}: LaporanNilaiPrintSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const cetakLaporan = useReactToPrint({
    contentRef,
    documentTitle: "Laporan Hasil Nilai Siswa",
    pageStyle: `
      @media print {
        @page {
          size: landscape;
          margin: 15mm;
        }

        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .laporan-print-area {
          padding: 0 !important;
          background: #ffffff !important;
        }

        .laporan-print-area [data-slot="table-container"] {
          overflow: visible !important;
        }

        .laporan-print-area table {
          width: 100% !important;
          table-layout: auto !important;
          border-collapse: collapse !important;
        }

        .laporan-print-area th,
        .laporan-print-area td {
          border: 1px solid #cbd5e1 !important;
          padding: 6px 8px !important;
          white-space: normal !important;
          word-break: break-word !important;
          vertical-align: top !important;
        }
      }
    `,
  });

  return (
    <Card className="rounded-xl border bg-white shadow-sm print:border-none print:p-0 print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50">
        <CardTitle>Tabel Laporan Hasil Nilai Siswa</CardTitle>
        <Button
          type="button"
          className="h-11 rounded-xl px-5 font-semibold"
          onClick={() => cetakLaporan()}
        >
          <Printer className="size-4" />
          Cetak Laporan
        </Button>
      </CardHeader>
      <CardContent className="p-4 print:p-0">
        <div
          ref={contentRef}
          className="laporan-print-area bg-white text-sm print:p-0 print:[&_div]:overflow-visible print:[&_table]:w-full print:[&_table]:table-auto"
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Laporan Hasil Nilai Siswa</h1>
            <p className="text-sm text-slate-600">
              Dicetak melalui Sistem Informasi Akademik
            </p>
          </div>

          <div className="overflow-x-auto rounded-md border print:overflow-visible print:rounded-none print:border-none">
          <Table
            className="w-full whitespace-nowrap border-collapse text-sm break-words print:whitespace-normal"
            containerClassName="print:overflow-visible"
          >
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="whitespace-normal break-words border border-slate-300 text-xs font-semibold uppercase text-slate-700">
                  Siswa
                </TableHead>
                <TableHead className="whitespace-normal break-words border border-slate-300 text-xs font-semibold uppercase text-slate-700">
                  Kelas
                </TableHead>
                <TableHead className="whitespace-normal break-words border border-slate-300 text-xs font-semibold uppercase text-slate-700">
                  Mata Pelajaran
                </TableHead>
                <TableHead className="whitespace-normal break-words border border-slate-300 text-xs font-semibold uppercase text-slate-700">
                  Guru
                </TableHead>
                <TableHead className="whitespace-normal break-words border border-slate-300 text-center text-xs font-semibold uppercase text-slate-700">
                  Tugas
                </TableHead>
                <TableHead className="whitespace-normal break-words border border-slate-300 text-center text-xs font-semibold uppercase text-slate-700">
                  UTS
                </TableHead>
                <TableHead className="whitespace-normal break-words border border-slate-300 text-center text-xs font-semibold uppercase text-slate-700">
                  UAS
                </TableHead>
                <TableHead className="whitespace-normal break-words border border-slate-300 text-center text-xs font-semibold uppercase text-slate-700">
                  Nilai Akhir
                </TableHead>
                <TableHead className="whitespace-normal break-words border border-slate-300 text-xs font-semibold uppercase text-slate-700">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    Data laporan nilai belum tersedia untuk filter ini.
                  </TableCell>
                </TableRow>
              ) : null}

              {data.map((nilai) => (
                <TableRow key={nilai.id}>
                  <TableCell className="whitespace-normal break-words border border-slate-300 font-medium">
                    {nilai.siswa}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words border border-slate-300">
                    {nilai.kelas}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words border border-slate-300">
                    {nilai.mataPelajaran}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words border border-slate-300">
                    {nilai.guru}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words border border-slate-300 text-center tabular-nums">
                    {formatNilai(nilai.tugas)}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words border border-slate-300 text-center tabular-nums">
                    {formatNilai(nilai.uts)}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words border border-slate-300 text-center tabular-nums">
                    {formatNilai(nilai.uas)}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words border border-slate-300 text-center font-semibold tabular-nums">
                    {formatNilai(nilai.nilaiAkhir)}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words border border-slate-300">
                    <BadgeStatus status={nilai.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
