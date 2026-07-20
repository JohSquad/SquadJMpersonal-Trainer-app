"use server";

import { createClient } from "@/utils/supabase/server";
import { sendEmail } from "@/lib/email";
import { formatCurrency, formatDate } from "@/types/database";

function montarEmail(mensagemPadrao: string, valor: string, vencimento: string, chavePix: string) {
  const mensagem = mensagemPadrao || "Sua mensalidade está em aberto.";
  return `
    <div style="font-family: sans-serif; max-width: 500px; white-space: pre-line;">
      <p>${mensagem}</p>
      <p><strong>Valor:</strong> ${valor}</p>
      <p><strong>Vencimento:</strong> ${vencimento}</p>
      <p><strong>Chave Pix para pagamento:</strong> ${chavePix}</p>
    </div>
  `;
}

function emailVencimento(nomeAluno: string, valor: string, vencimento: string, chavePix: string) {
  return `
    <div style="font-family: sans-serif; max-width: 500px;">
      <h2>Olá, ${nomeAluno}!</h2>
      <p>Sua mensalidade <strong>vence hoje</strong>.</p>
      <p><strong>Valor:</strong> ${valor}</p>
      <p><strong>Vencimento:</strong> ${vencimento}</p>
      <p><strong>Chave Pix para pagamento:</strong> ${chavePix}</p>
      <p>Qualquer dúvida, é só chamar!</p>
    </div>
  `;
}

export async function verificarENotificarPagamentos() {
  const supabase = await createClient();

 const { data: personal } = await supabase
    .from("personal")
    .select("chave_pix, mensagem_padrao")
    .limit(1)
    .single();

  const chavePix = personal?.chave_pix || "chave não configurada";
  const mensagemPadrao = personal?.mensagem_padrao || "";

  const hoje = new Date();
  const daqui5Dias = new Date();
  daqui5Dias.setDate(hoje.getDate() + 5);

  const hojeStr = hoje.toISOString().split("T")[0];
  const daqui5DiasStr = daqui5Dias.toISOString().split("T")[0];

  const { data: pagamentos } = await supabase
    .from("pagamentos")
    .select("*, profiles:aluno_id(nome, email)")
    .in("status", ["pendente", "atrasado"])
    .in("data_vencimento", [hojeStr, daqui5DiasStr]);

  if (!pagamentos || pagamentos.length === 0) {
    return { enviados: 0 };
  }

  let enviados = 0;

  for (const pagamento of pagamentos as any[]) {
    const aluno = pagamento.profiles;
    if (!aluno?.email) continue;

    const valor = formatCurrency(pagamento.valor);
    const vencimento = formatDate(pagamento.data_vencimento);

    if (pagamento.data_vencimento === daqui5DiasStr) {
      await sendEmail(
        aluno.email,
        "Aviso de pagamento — SQUAD JM",
        montarEmail(mensagemPadrao, valor, vencimento, chavePix)
      );
      enviados++;
    } else if (pagamento.data_vencimento === hojeStr) {
      await sendEmail(
        aluno.email,
        "Aviso de pagamento — SQUAD JM",
        montarEmail(mensagemPadrao, valor, vencimento, chavePix)
      );
      enviados++;
    }
  }

  return { enviados };
}
