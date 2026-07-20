"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { registerPersonal } from "@/lib/actions/auth";

export default function RegisterPersonalPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await registerPersonal(formData)) ?? null;
    },
    null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Dumbbell className="w-8 h-8 text-teal-600" />
            <span className="text-xl font-bold text-gray-900">FitManager</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro Personal Trainer</h1>
          <p className="text-gray-500 mt-1">Crie sua conta gratuita</p>
        </div>

        <form action={formAction} className="space-y-4">
          <Input label="Nome completo" name="nome" required placeholder="Seu nome" />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
          />
          <Input
            label="Telefone"
            name="telefone"
            type="tel"
            placeholder="(11) 99999-9999"
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
          />

          {state?.error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
              {state.error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={pending}>
            Criar conta
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Já tem conta?{" "}
          <Link
            href="/auth/login/personal"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Fazer login
          </Link>
        </div>
      </Card>
    </div>
  );
}
