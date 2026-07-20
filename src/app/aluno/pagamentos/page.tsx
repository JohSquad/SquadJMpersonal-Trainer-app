import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { getMeusPagamentos } from "@/lib/actions/pagamentos";
import {
  formatCurrency,
  formatDate,
  getPaymentStatusColor,
} from "@/types/database";

import { createClient } from "@/utils/supabase/server";

export default async function AlunoPagamentosPage() {
  const pagamentos = await getMeusPagamentos();

  const supabase = await createClient();
  const { data: personal } = await supabase
    .from("personal")
    .select("chave_pix")
    .limit(1)
    .single();
  const chavePix = personal?.chave_pix || "Chave não configurada";

  const pendentes = pagamentos.filter(
    (p) => p.status === "pendente" || p.status === "atrasado"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meus Pagamentos</h1>
        <p className="text-gray-500 mt-1">Status das suas mensalidades</p>
      </div>

      {pendentes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <p className="text-amber-800 font-medium">
            Você tem {pendentes.length} pagamento(s) pendente(s).
          </p>
        </Card>
      )}
      
      <Card className="border-teal-200 bg-teal-50">
        <p className="text-teal-800 font-medium">Chave Pix para pagamento:</p>
        <p className="text-teal-900 text-lg font-bold mt-1">{chavePix}</p>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>

        {pagamentos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum pagamento registrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">
                    Vencimento
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Valor</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">
                    Data Pagamento
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">
                    Observações
                  </th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
