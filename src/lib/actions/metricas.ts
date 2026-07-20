"use server";

import { createClient } from "@/utils/supabase/server";
import { calcularIMC } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function createMetrica(alunoId: string, formData: FormData) {
  const supabase = await createClient();

  const peso = parseFloat(formData.get("peso") as string);
  const altura = parseFloat(formData.get("altura") as string);
  const percentualGordura = formData.get("percentual_gordura") as string;

  if (isNaN(peso) || isNaN(altura)) {
    return { error: "Peso e altura são obrigatórios." };
  }

  const imc = calcularIMC(peso, altura);

  const { error } = await supabase.from("metricas").insert({
    aluno_id: alunoId,
    peso,
    altura,
    imc,
    percentual_gordura: percentualGordura
      ? parseFloat(percentualGordura)
      : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/personal/alunos/${alunoId}`);
  revalidatePath(`/personal/alunos/${alunoId}/metricas`);
  return { success: true };
}

export async function getMetricas(alunoId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("metricas")
    .select("*")
    .eq("aluno_id", alunoId)
    .order("data_registro", { ascending: true });

  return data || [];
}

export async function deleteMetrica(metricaId: string, alunoId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("metricas")
    .delete()
    .eq("id", metricaId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/personal/alunos/${alunoId}/metricas`);
  return { success: true };
}

export async function getMinhasMetricas() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("metricas")
    .select("*")
    .eq("aluno_id", user.id)
    .order("data_registro", { ascending: true });

  return data || [];
}
