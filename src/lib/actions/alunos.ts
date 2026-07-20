"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

function gerarSenhaTemporaria(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let senha = "";
  for (let i = 0; i < 10; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
}

export async function createAluno(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado." };

  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const telefone = formData.get("telefone") as string;
  const dataNascimento = formData.get("data_nascimento") as string;
  const senha = gerarSenhaTemporaria();

  const admin = createAdminClient();

  if (!admin) {
    return {
      error:
        "Configure SUPABASE_SERVICE_ROLE_KEY no .env.local para criar alunos diretamente. Alternativamente, compartilhe seu código de convite para o aluno se cadastrar.",
    };
  }

  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome, tipo: "aluno" },
    });

  if (authError) {
    return { error: authError.message };
  }

  if (authData.user) {
    const { error: profileError } = await admin.from("profiles").insert({
      id: authData.user.id,
      nome,
      email,
      tipo: "aluno",
      telefone: telefone || null,
      data_nascimento: dataNascimento || null,
      personal_id: user.id,
    });

    if (profileError) {
      return { error: "Erro ao criar perfil: " + profileError.message };
    }
  }

  revalidatePath("/personal/dashboard");
  revalidatePath("/personal/alunos");
  return { success: true, senhaTemporaria: senha };
}

export async function updateAluno(alunoId: string, formData: FormData) {
  const supabase = await createClient();

  const nome = formData.get("nome") as string;
  const telefone = formData.get("telefone") as string;
  const dataNascimento = formData.get("data_nascimento") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      nome,
      telefone: telefone || null,
      data_nascimento: dataNascimento || null,
    })
    .eq("id", alunoId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/personal/alunos/${alunoId}`);
  revalidatePath("/personal/dashboard");
  return { success: true };
}

export async function getAlunos() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("personal_id", user.id)
    .eq("tipo", "aluno")
    .order("nome");

  return data || [];
}

export async function getAluno(alunoId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", alunoId)
    .eq("tipo", "aluno")
    .single();

  return data;
}

export async function getAlunoStats(alunoId: string) {
  const supabase = await createClient();

  const [metricasRes, pagamentosRes, treinosRes] = await Promise.all([
    supabase
      .from("metricas")
      .select("*")
      .eq("aluno_id", alunoId)
      .order("data_registro", { ascending: false })
      .limit(1),
    supabase
      .from("pagamentos")
      .select("*")
      .eq("aluno_id", alunoId)
      .order("data_vencimento", { ascending: false }),
    supabase.from("treinos").select("id").eq("aluno_id", alunoId),
  ]);

  const ultimaMetrica = metricasRes.data?.[0] || null;
  const pagamentosPendentes =
    pagamentosRes.data?.filter(
      (p) => p.status === "pendente" || p.status === "atrasado"
    ).length || 0;
  const totalTreinos = treinosRes.data?.length || 0;

  return { ultimaMetrica, pagamentosPendentes, totalTreinos };
}
