"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteAluno } from "@/lib/actions/alunos";

export function DeleteAlunoButton({ alunoId, nomeAluno }: { alunoId: string; nomeAluno: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setExcluindo(true);
    const result = await deleteAluno(alunoId);

    if (result.error) {
      alert(result.error);
      setExcluindo(false);
      setConfirmando(false);
      return;
    }

    router.push("/personal/dashboard");
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">Excluir {nomeAluno}?</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={excluindo}
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          {excluindo ? "Excluindo..." : "Confirmar"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirmando(false)} disabled={excluindo}>
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setConfirmando(true)}
      className="border-red-300 text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
      Excluir
    </Button>
  );
}
