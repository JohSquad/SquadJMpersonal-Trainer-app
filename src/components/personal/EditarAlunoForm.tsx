"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { updateAluno } from "@/lib/actions/alunos";
import type { Profile } from "@/types/database";

interface PageProps {
  aluno: Profile;
}

export function EditarAlunoForm({ aluno }: PageProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return (await updateAluno(aluno.id, formData)) ?? null;
    },
    null
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link
        href={`/personal/alunos/${aluno.id}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <Card>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Aluno</h1>

        {state?.success && (
          <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg mb-4">
            Dados atualizados com sucesso!
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            label="Nome completo"
            name="nome"
            required
            defaultValue={aluno.nome}
          />
          <Input
            label="Telefone"
            name="telefone"
            type="tel"
            defaultValue={aluno.telefone || ""}
          />
          <Input
            label="Data de nascimento"
            name="data_nascimento"
            type="date"
            defaultValue={aluno.data_nascimento || ""}
          />

          {state?.error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
              {state.error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={pending}>
            Salvar Alterações
          </Button>
        </form>
      </Card>
    </div>
  );
}
