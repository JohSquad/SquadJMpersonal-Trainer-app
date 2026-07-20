import { notFound } from "next/navigation";
import { getAluno } from "@/lib/actions/alunos";
import { EditarAlunoForm } from "@/components/personal/EditarAlunoForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarAlunoPage({ params }: PageProps) {
  const { id } = await params;
  const aluno = await getAluno(id);

  if (!aluno) notFound();

  return <EditarAlunoForm aluno={aluno} />;
}
