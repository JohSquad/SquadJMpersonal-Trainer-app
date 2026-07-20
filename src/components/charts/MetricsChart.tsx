"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDate } from "@/types/database";
import type { Metrica } from "@/types/database";

interface MetricsChartProps {
  metricas: Metrica[];
}

export function MetricsChart({ metricas }: MetricsChartProps) {
  if (metricas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Nenhuma métrica registrada ainda.
      </div>
    );
  }

  const data = metricas.map((m) => ({
    data: formatDate(m.data_registro),
    peso: m.peso,
    imc: m.imc,
    gordura: m.percentual_gordura,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="data"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="peso"
          name="Peso (kg)"
          stroke="#0d9488"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="imc"
          name="IMC"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="gordura"
          name="% Gordura"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 4 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
