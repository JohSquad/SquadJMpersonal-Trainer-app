"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTreino(alunoId: string, formData: FormData) {
  const supabase = await createClient();

  const nomeTreino = formData.get("nome_treino") as string;
  const descricao = formData.get("descricao") as string;
  const diaSemana = parseInt(formData.get("dia_semana") as string);

  const { data: treino, error } = await supabase
    .from("treinos")
    .insert({
      aluno_id: alunoId,
      nome_treino: nomeTreino,
      descricao: descricao || null,
      dia_semana: diaSemana,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  const exerciciosJson = formData.get("exercicios") as string;
  if (exerciciosJson && treino) {
    const exercicios = JSON.parse(exerciciosJson) as Array<{
      nome_exercicio: string;
      series: number;
      repeticoes: string;
      carga: string;
      observacoes: string;
    }>;

    if (exercicios.length > 0) {
      const { error: exError } = await supabase.from("exercicios").insert(
        exercicios.map((ex, index) => ({
          treino_id: treino.id,
          nome_exercicio: ex.nome_exercicio,
          series: ex.series,
          repeticoes: ex.repeticoes,
          carga: ex.carga || null,
          observacoes: ex.observacoes || null,
          ordem: index,
        }))
      );

      if (exError) {
        return { error: exError.message };
      }
    }
  }

  revalidatePath(`/personal/alunos/${alunoId}/treinos`);
  return { success: true };
}

export async function updateTreino(
  treinoId: string,
  alunoId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const nomeTreino = formData.get("nome_treino") as string;
  const descricao = formData.get("descricao") as string;
  const diaSemana = parseInt(formData.get("dia_semana") as string);

  const { error } = await supabase
    .from("treinos")
    .update({
      nome_treino: nomeTreino,
      descricao: descricao || null,
      dia_semana: diaSemana,
    })
    .eq("id", treinoId);

  if (error) {
    return { error: error.message };
  }

  await supabase.from("exercicios").delete().eq("treino_id", treinoId);

  const exerciciosJson = formData.get("exercicios") as string;
  if (exerciciosJson) {
    const exercicios = JSON.parse(exerciciosJson) as Array<{
      nome_exercicio: string;
      series: number;
      repeticoes: string;
      carga: string;
      observacoes: string;
    }>;

    if (exercicios.length > 0) {
      await supabase.from("exercicios").insert(
        exercicios.map((ex, index) => ({
          treino_id: treinoId,
          nome_exercicio: ex.nome_exercicio,
          series: ex.series,
          repeticoes: ex.repeticoes,
          carga: ex.carga || null,
          observacoes: ex.observacoes || null,
          ordem: index,
        }))
      );
    }
  }

  revalidatePath(`/personal/alunos/${alunoId}/treinos`);
  return { success: true };
}

export async function deleteTreino(treinoId: string, alunoId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("treinos").delete().eq("id", treinoId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/personal/alunos/${alunoId}/treinos`);
  return { success: true };
}

export async function getTreinos(alunoId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("treinos")
    .select("*, exercicios(*)")
    .eq("aluno_id", alunoId)
    .order("dia_semana");

  if (data) {
    data.forEach((treino) => {
      if (treino.exercicios) {
        treino.exercicios.sort(
          (a: { ordem: number }, b: { ordem: number }) => a.ordem - b.ordem
        );
      }
    });
  }

  return data || [];
}

export async function getMeusTreinos() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("treinos")
    .select("*, exercicios(*)")
    .eq("aluno_id", user.id)
    .order("dia_semana");

  if (data) {
    data.forEach((treino) => {
      if (treino.exercicios) {
        treino.exercicios.sort(
          (a: { ordem: number }, b: { ordem: number }) => a.ordem - b.ordem
        );
      }
    });
  }

  return data || [];
}

export async function getTreino(treinoId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("treinos")
    .select("*, exercicios(*)")
    .eq("id", treinoId)
    .single();

  if (data?.exercicios) {
    data.exercicios.sort(
      (a: { ordem: number }, b: { ordem: number }) => a.ordem - b.ordem
    );
  }

  return data;
}
