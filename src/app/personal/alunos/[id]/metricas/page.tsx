import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { MetricsChart } from "@/components/charts/MetricsChart";
import { MetricaForm } from "@/components/personal/MetricaForm";
import { MetricasTable } from "@/components/personal/MetricasTable";
import { getAluno } from "@/lib/actions/alunos";
import { getMetricas } from "@/lib/actions/metricas";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MetricasPage({ params }: PageProps) {
  const { id } = await params;
  const aluno = await getAluno(id);
  if (!aluno) notFound();

  const metricas = await getMetricas(id);

  return (
    <div className="space-y-6">
      <Link
        href={`/personal/alunos/${id}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para {aluno.nome}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">Métricas — {aluno.nome}</h1>

      <MetricaForm alunoId={id} />

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
        <MetricasTable metricas={metricas} alunoId={id} />
      </Card>
    </div>
  );
}
