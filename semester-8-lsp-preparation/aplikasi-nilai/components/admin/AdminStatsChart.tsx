"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AdminChartPoint = {
  kelas: string;
  jumlahSiswa: number;
  rataRataNilai: number;
};

type AdminStatsChartProps = {
  data: AdminChartPoint[];
};

export function AdminStatsChart({ data }: AdminStatsChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  return (
    <div className="h-[350px] w-full mt-6 bg-white p-6 rounded-xl border shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">
            Distribusi Nilai Per Kelas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Statistik jumlah siswa dan rata-rata nilai berdasarkan kelas.
          </p>
        </div>
        <div className="hidden rounded-lg bg-slate-100 p-1 text-sm font-medium sm:flex">
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={
              chartType === "bar"
                ? "rounded-md bg-white px-3 py-1 text-primary shadow-sm"
                : "rounded-md px-3 py-1 text-muted-foreground transition hover:text-primary"
            }
          >
            Batang
          </button>
          <button
            type="button"
            onClick={() => setChartType("line")}
            className={
              chartType === "line"
                ? "rounded-md bg-white px-3 py-1 text-primary shadow-sm"
                : "rounded-md px-3 py-1 text-muted-foreground transition hover:text-primary"
            }
          >
            Garis
          </button>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 12, right: 8, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="kelas" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(15, 118, 110, 0.06)" }}
                contentStyle={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Bar
                dataKey="jumlahSiswa"
                fill="var(--primary)"
                name="Jumlah Siswa"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 12, right: 8, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="kelas" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="rataRataNilai"
                name="Rata-rata Nilai"
                stroke="#0f766e"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "#0f766e",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
