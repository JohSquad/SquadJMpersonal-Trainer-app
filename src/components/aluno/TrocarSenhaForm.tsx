"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { changePassword } from "@/lib/actions/auth";

export function TrocarSenhaForm() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setMensagem("");
    setErro("");

    const formData = new FormData();
    formData.set("nova_senha", novaSenha);
    formData.set("confirmar_senha", confirmarSenha);

    const result = await changePassword(formData);

    if (result.error) {
      setErro(result.error);
    } else {
      setMensagem("Senha alterada com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
    }
    setEnviando(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nova senha
        </label>
        <input
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar nova senha
        </label>
        <input
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {mensagem && <p className="text-sm text-emerald-600">{mensagem}</p>}

      <Button type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Alterar senha"}
      </Button>
    </form>
  );
}
