"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createAluno } from "@/lib/actions/alunos";

export default function NovoAlunoPage() {
  const [senhaTemp, setSenhaTemp] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(
    async (
      _prev: { error?: string; senhaTemporaria?: string } | null,
      formData: FormData
    ) => {
      const result = await createAluno(formData);
      if (result?.senhaTemporaria) {
        setSenhaTemp(result.senhaTemporaria);
      }
      return result ?? null;
    },
    null
  );

  if (senhaTemp) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Aluno cadastrado!</h2>
            <p className="text-gray-500">
              Compartilhe a senha temporária com o aluno. Ele poderá alterá-la após o primeiro login.
            </p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Senha temporária</p>
              <p className="text-2xl font-mono font-bold text-gray-900">{senhaTemp}</p>
            </div>
            <Link href="/personal/dashboard">
              <Button className="w-full">Voltar ao Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link
        href="/personal/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <Card>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cadastrar Novo Aluno</h1>

        <form action={formAction} className="space-y-4">
          <Input label="Nome completo" name="nome" required placeholder="Nome do aluno" />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="email@exemplo.com"
          />
          <Input
            label="Telefone"
            name="telefone"
            type="tel"
            placeholder="(11) 99999-9999"
          />
          <Input label="Data de nascimento" name="data_nascimento" type="date" />

          {state?.error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
              {state.error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={pending}>
            Cadastrar Aluno
          </Button>
        </form>
      </Card>
    </div>
  );
}
