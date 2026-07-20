import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { MetricsChart } from "@/components/charts/MetricsChart";
import { getMinhasMetricas } from "@/lib/actions/metricas";
import { formatDate } from "@/types/database";

export default async function AlunoMetricasPage() {
  const metricas = await getMinhasMetricas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minhas Métricas</h1>
        <p className="text-gray-500 mt-1">Acompanhe sua evolução física</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Evolução</CardTitle>
        </CardHeader>
        <MetricsChart metricas={metricas} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>

        {metricas.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhuma métrica registrada ainda. Seu personal irá registrar suas medições.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Data</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Peso</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Altura</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">IMC</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">% Gordura</th>
                </tr>
              </thead>
              <tbody>
                {[...metricas].reverse().map((m) => (
                  <tr key={m.id} className="border-b border-gray-100">
                    <td className="py-3 px-2">{formatDate(m.data_registro)}</td>
                    <td className="py-3 px-2">{m.peso} kg</td>
                    <td className="py-3 px-2">{m.altura} cm</td>
                    <td className="py-3 px-2 font-medium">{m.imc}</td>
                    <td className="py-3 px-2">
                      {m.percentual_gordura ? `${m.percentual_gordura}%` : "—"}
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
