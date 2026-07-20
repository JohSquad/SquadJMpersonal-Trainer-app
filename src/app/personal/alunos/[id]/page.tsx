import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Activity,
  Dumbbell,
  CreditCard,
  Edit,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricsChart } from "@/components/charts/MetricsChart";
import { getAluno, getAlunoStats } from "@/lib/actions/alunos";
import { getMetricas } from "@/lib/actions/metricas";
import { getPagamentos } from "@/lib/actions/pagamentos";
import { formatDate } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlunoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const aluno = await getAluno(id);

  if (!aluno) notFound();

  const [stats, metricas, pagamentos] = await Promise.all([
    getAlunoStats(id),
    getMetricas(id),
    getPagamentos(id),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/personal/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao Dashboard
      </Link>

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-teal-700">
              {aluno.nome.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{aluno.nome}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> {aluno.email}
              </span>
              {aluno.telefone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {aluno.telefone}
                </span>
              )}
              {aluno.data_nascimento && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {formatDate(aluno.data_nascimento)}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href={`/personal/alunos/${id}/editar`}>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-sm text-gray-500">Peso atual</p>
          <p className="text-xl font-bold text-gray-900">
            {stats.ultimaMetrica ? `${stats.ultimaMetrica.peso} kg` : "—"}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-500">IMC</p>
          <p className="text-xl font-bold text-gray-900">
            {stats.ultimaMetrica ? stats.ultimaMetrica.imc : "—"}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-500">Treinos</p>
          <p className="text-xl font-bold text-gray-900">{stats.totalTreinos}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-500">Pagamentos</p>
          {stats.pagamentosPendentes > 0 ? (
            <Badge variant="warning">{stats.pagamentosPendentes} pendente(s)</Badge>
          ) : (
            <Badge variant="success">Em dia</Badge>
          )}
        </Card>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2">
        <Link href={`/personal/alunos/${id}/metricas`}>
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4" />
            Métricas
          </Button>
        </Link>
        <Link href={`/personal/alunos/${id}/treinos`}>
          <Button variant="outline" size="sm">
            <Dumbbell className="w-4 h-4" />
            Treinos
          </Button>
        </Link>
        <Link href={`/personal/alunos/${id}/pagamentos`}>
          <Button variant="outline" size="sm">
            <CreditCard className="w-4 h-4" />
            Pagamentos
          </Button>
        </Link>
      </div>

      {/* Evolution chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Física</CardTitle>
        </CardHeader>
        <MetricsChart metricas={metricas} />
      </Card>
    </div>
  );
}
