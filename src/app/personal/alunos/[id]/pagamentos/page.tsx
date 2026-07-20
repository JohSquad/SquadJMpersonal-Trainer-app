import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PagamentoManager } from "@/components/personal/PagamentoManager";
import { getAluno } from "@/lib/actions/alunos";
import { getPagamentos } from "@/lib/actions/pagamentos";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PagamentosPage({ params }: PageProps) {
  const { id } = await params;
  const aluno = await getAluno(id);
  if (!aluno) notFound();

  const pagamentos = await getPagamentos(id);

  return (
    <div className="space-y-6">
      <Link
        href={`/personal/alunos/${id}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para {aluno.nome}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">Pagamentos — {aluno.nome}</h1>

      <PagamentoManager alunoId={id} pagamentos={pagamentos} />
    </div>
  );
}
