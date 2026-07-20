import Link from "next/link";
import { Activity, Dumbbell, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MetricsChart } from "@/components/charts/MetricsChart";
import { getCurrentProfile } from "@/lib/actions/auth";
import { getMinhasMetricas } from "@/lib/actions/metricas";
import { getMeusTreinos } from "@/lib/actions/treinos";
import { getMeusPagamentos } from "@/lib/actions/pagamentos";
import { DIAS_SEMANA } from "@/types/database";

export default async function AlunoDashboardPage() {
  const profile = await getCurrentProfile();
  const [metricas, treinos, pagamentos] = await Promise.all([
    getMinhasMetricas(),
    getMeusTreinos(),
    getMeusPagamentos(),
  ]);

  const ultimaMetrica = metricas.length > 0 ? metricas[metricas.length - 1] : null;
  const pagamentosPendentes = pagamentos.filter(
    (p) => p.status === "pendente" || p.status === "atrasado"
  );
  const hoje = new Date().getDay();
  const treinoHoje = treinos.filter((t) => t.dia_semana === hoje);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Olá, {profile?.nome?.split(" ")[0]}!
        </h1>
        <p className="text-gray-500 mt-1">Acompanhe seu progresso e treinos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-xs text-gray-500">Peso atual</p>
              <p className="text-lg font-bold text-gray-900">
                {ultimaMetrica ? `${ultimaMetrica.peso} kg` : "—"}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">IMC</p>
              <p className="text-lg font-bold text-gray-900">
                {ultimaMetrica ? ultimaMetrica.imc : "—"}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-xs text-gray-500">Treinos</p>
              <p className="text-lg font-bold text-gray-900">{treinos.length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-gray-500">Pagamentos</p>
              {pagamentosPendentes.length > 0 ? (
                <Badge variant="warning">{pagamentosPendentes.length} pendente(s)</Badge>
              ) : (
                <Badge variant="success">Em dia</Badge>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Today's workout */}
      {treinoHoje.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Treino de Hoje — {DIAS_SEMANA[hoje]}</CardTitle>
          </CardHeader>
          {treinoHoje.map((treino) => (
            <div key={treino.id} className="mb-4 last:mb-0">
              <h4 className="font-medium text-gray-900 mb-2">{treino.nome_treino}</h4>
              {treino.exercicios && (
                <div className="space-y-1">
                  {treino.exercicios.map((ex) => (
                    <div
                      key={ex.id}
                      className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0"
                    >
                      <span>{ex.nome_exercicio}</span>
                      <span className="text-gray-500">
                        {ex.series}x{ex.repeticoes}
                        {ex.carga ? ` — ${ex.carga}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/aluno/treino"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2 inline-block"
          >
            Ver todos os treinos →
          </Link>
        </Card>
      )}

      {/* Evolution chart */}
      <Card>
        <CardHeader>
          <CardTitle>Minha Evolução</CardTitle>
        </CardHeader>
        <MetricsChart metricas={metricas} />
        <Link
          href="/aluno/metricas"
          className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-4 inline-block"
        >
          Ver histórico completo →
        </Link>
      </Card>
    </div>
  );
}
