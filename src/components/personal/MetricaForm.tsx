"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { createMetrica } from "@/lib/actions/metricas";
import { calcularIMC } from "@/types/database";
import { useState } from "react";

interface MetricaFormProps {
  alunoId: string;
}

export function MetricaForm({ alunoId }: MetricaFormProps) {
  const [imcPreview, setImcPreview] = useState<number | null>(null);

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await createMetrica(alunoId, formData);
      if (result?.success) setImcPreview(null);
      return result ?? null;
    },
    null
  );

  function handleCalc() {
    const peso = parseFloat(
      (document.getElementById("peso") as HTMLInputElement)?.value
    );
    const altura = parseFloat(
      (document.getElementById("altura") as HTMLInputElement)?.value
    );
    if (!isNaN(peso) && !isNaN(altura)) {
      setImcPreview(calcularIMC(peso, altura));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nova Métrica</CardTitle>
      </CardHeader>

      {state?.success && (
        <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg mb-4">
          Métrica registrada com sucesso!
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            id="peso"
            label="Peso (kg)"
            name="peso"
            type="number"
            step="0.1"
            required
            placeholder="75.5"
            onChange={handleCalc}
          />
          <Input
            id="altura"
            label="Altura (cm)"
            name="altura"
            type="number"
            step="0.1"
            required
            placeholder="175"
            onChange={handleCalc}
          />
          <Input
            label="% Gordura corporal"
            name="percentual_gordura"
            type="number"
            step="0.1"
            placeholder="15.0"
          />
        </div>

        {imcPreview && (
          <div className="bg-teal-50 text-teal-800 text-sm p-3 rounded-lg">
            IMC calculado: <strong>{imcPreview}</strong>
          </div>
        )}

        {state?.error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
            {state.error}
          </div>
        )}

        <Button type="submit" loading={pending}>
          Registrar Métrica
        </Button>
      </form>
    </Card>
  );
}
