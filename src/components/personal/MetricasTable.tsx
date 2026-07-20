"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteMetrica } from "@/lib/actions/metricas";
import { formatDate } from "@/types/database";
import type { Metrica } from "@/types/database";

interface MetricasTableProps {
  metricas: Metrica[];
  alunoId: string;
}

export function MetricasTable({ metricas, alunoId }: MetricasTableProps) {
  async function handleDelete(id: string) {
    if (confirm("Deseja excluir esta métrica?")) {
      await deleteMetrica(id, alunoId);
    }
  }

  if (metricas.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">Nenhuma métrica registrada.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-medium text-gray-500">Data</th>
            <th className="text-left py-3 px-2 font-medium text-gray-500">Peso</th>
            <th className="text-left py-3 px-2 font-medium text-gray-500">Altura</th>
            <th className="text-left py-3 px-2 font-medium text-gray-500">IMC</th>
            <th className="text-left py-3 px-2 font-medium text-gray-500">% Gordura</th>
            <th className="text-right py-3 px-2 font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody>
          {[...metricas].reverse().map((m) => (
            <tr key={m.id} className="border-b border-gray-100">
              <td className="py-3 px-2 text-gray-900">{formatDate(m.data_registro)}</td>
              <td className="py-3 px-2">{m.peso} kg</td>
              <td className="py-3 px-2">{m.altura} cm</td>
              <td className="py-3 px-2 font-medium">{m.imc}</td>
              <td className="py-3 px-2">{m.percentual_gordura ? `${m.percentual_gordura}%` : "—"}</td>
              <td className="py-3 px-2 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(m.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
