import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TreinoManager } from "@/components/personal/TreinoManager";
import { getAluno } from "@/lib/actions/alunos";
import { getTreinos } from "@/lib/actions/treinos";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TreinosPage({ params }: PageProps) {
  const { id } = await params;
  const aluno = await getAluno(id);
  if (!aluno) notFound();

  const treinos = await getTreinos(id);

  return (
    <div className="space-y-6">
      <Link
        href={`/personal/alunos/${id}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para {aluno.nome}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">Treinos — {aluno.nome}</h1>

      <TreinoManager alunoId={id} treinos={treinos} />
    </div>
  );
}
