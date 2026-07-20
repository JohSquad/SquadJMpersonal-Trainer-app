"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { PaymentStatus } from "@/types/database";

export async function createPagamento(alunoId: string, formData: FormData) {
  const supabase = await createClient();

  const valor = parseFloat(formData.get("valor") as string);
  const status = formData.get("status") as PaymentStatus;
  const dataVencimento = formData.get("data_vencimento") as string;
  const dataPagamento = formData.get("data_pagamento") as string;
  const observacoes = formData.get("observacoes") as string;

  if (isNaN(valor)) {
    return { error: "Valor é obrigatório." };
  }

  const { error } = await supabase.from("pagamentos").insert({
    aluno_id: alunoId,
    valor,
    status,
    data_vencimento: dataVencimento,
    data_pagamento: dataPagamento || null,
    observacoes: observacoes || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/personal/alunos/${alunoId}/pagamentos`);
  revalidatePath("/personal/dashboard");
  return { success: true };
}

export async function updatePagamento(
  pagamentoId: string,
  alunoId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const valor = parseFloat(formData.get("valor") as string);
  const status = formData.get("status") as PaymentStatus;
  const dataVencimento = formData.get("data_vencimento") as string;
  const dataPagamento = formData.get("data_pagamento") as string;
  const observacoes = formData.get("observacoes") as string;

  const { error } = await supabase
    .from("pagamentos")
    .update({
      valor,
      status,
      data_vencimento: dataVencimento,
      data_pagamento: dataPagamento || null,
      observacoes: observacoes || null,
    })
    .eq("id", pagamentoId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/personal/alunos/${alunoId}/pagamentos`);
  return { success: true };
}

export async function deletePagamento(pagamentoId: string, alunoId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("pagamentos")
    .delete()
    .eq("id", pagamentoId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/personal/alunos/${alunoId}/pagamentos`);
  return { success: true };
}

export async function getPagamentos(alunoId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("pagamentos")
    .select("*")
    .eq("aluno_id", alunoId)
    .order("data_vencimento", { ascending: false });

  return data || [];
}

export async function getMeusPagamentos() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("pagamentos")
    .select("*")
    .eq("aluno_id", user.id)
    .order("data_vencimento", { ascending: false });

  return data || [];
}

export async function marcarComoPago(pagamentoId: string, alunoId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("pagamentos")
    .update({
      status: "pago",
      data_pagamento: new Date().toISOString().split("T")[0],
    })
    .eq("id", pagamentoId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/personal/alunos/${alunoId}/pagamentos`);
  return { success: true };
}
