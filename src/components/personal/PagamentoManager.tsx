"use client";

import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { createPagamento, marcarComoPago, deletePagamento } from "@/lib/actions/pagamentos";
import { formatCurrency, formatDate, getPaymentStatusColor } from "@/types/database";
import type { Pagamento } from "@/types/database";

interface PagamentoManagerProps {
  alunoId: string;
  pagamentos: Pagamento[];
}

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "pago", label: "Pago" },
  { value: "atrasado", label: "Atrasado" },
];

export function PagamentoManager({ alunoId, pagamentos }: PagamentoManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createPagamento(alunoId, formData);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      window.location.reload();
    }
  }

  async function handleMarcarPago(id: string) {
    await marcarComoPago(id, alunoId);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (confirm("Deseja excluir este pagamento?")) {
      await deletePagamento(id, alunoId);
      window.location.reload();
    }
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Registrar Pagamento
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Pagamento</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Valor (R$)"
                name="valor"
                type="number"
                step="0.01"
                required
                placeholder="150.00"
              />
              <Select
                label="Status"
                name="status"
                options={statusOptions}
                defaultValue="pendente"
              />
              <Input
                label="Data de vencimento"
                name="data_vencimento"
                type="date"
                required
              />
              <Input
                label="Data de pagamento"
                name="data_pagamento"
                type="date"
              />
            </div>
            <Textarea
              label="Observações"
              name="observacoes"
              placeholder="Ex: Mensalidade março/2026"
            />

            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
            )}

            <div className="flex gap-2">
              <Button type="submit" loading={loading}>
                Registrar
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {pagamentos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum pagamento registrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Vencimento</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Valor</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Pagamento</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">Obs</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((p) => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="py-3 px-2">{formatDate(p.data_vencimento)}</td>
                  <td className="py-3 px-2 font-medium">{formatCurrency(p.valor)}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(p.status)}`}
                    >
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-2 hidden sm:table-cell">
                    {p.data_pagamento ? formatDate(p.data_pagamento) : "—"}
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell text-gray-500">
                    {p.observacoes || "—"}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex justify-end gap-1">
                      {p.status !== "pago" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarcarPago(p.id)}
                          title="Marcar como pago"
                          className="text-emerald-600"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
