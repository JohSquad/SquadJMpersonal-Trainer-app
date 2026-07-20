"use server";

import { createClient } from "@/utils/supabase/server";
import { gerarCodigoConvite } from "@/types/database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginPersonal(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou senha incorretos." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tipo")
      .eq("id", user.id)
      .single();

    if (profile?.tipo !== "personal") {
      await supabase.auth.signOut();
      return { error: "Esta conta não é de Personal Trainer." };
    }
  }

  redirect("/personal/dashboard");
}

export async function loginAluno(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou senha incorretos." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tipo")
      .eq("id", user.id)
      .single();

    if (profile?.tipo !== "aluno") {
      await supabase.auth.signOut();
      return { error: "Esta conta não é de Aluno." };
    }
  }

  redirect("/aluno/dashboard");
}

export async function registerPersonal(formData: FormData) {
  const supabase = await createClient();
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const telefone = formData.get("telefone") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, tipo: "personal" },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const codigo = gerarCodigoConvite();
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      nome,
      email,
      tipo: "personal",
      telefone: telefone || null,
      codigo_convite: codigo,
    });

    if (profileError) {
      return { error: "Erro ao criar perfil: " + profileError.message };
    }
  }

  redirect("/personal/dashboard");
}

export async function registerAluno(formData: FormData) {
  const supabase = await createClient();
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const telefone = formData.get("telefone") as string;
  const dataNascimento = formData.get("data_nascimento") as string;
  const codigoConvite = (formData.get("codigo_convite") as string)?.toUpperCase();

  if (!codigoConvite) {
    return { error: "Código de convite é obrigatório." };
  }

  const { data: personalId, error: inviteError } = await supabase.rpc(
    "get_personal_by_invite_code",
    { code: codigoConvite }
  );

  if (inviteError || !personalId) {
    return { error: "Código de convite inválido." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, tipo: "aluno" },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      nome,
      email,
      tipo: "aluno",
      telefone: telefone || null,
      data_nascimento: dataNascimento || null,
      personal_id: personalId,
    });

    if (profileError) {
      return { error: "Erro ao criar perfil: " + profileError.message };
    }
  }

  redirect("/aluno/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function updateAlunoPerfil(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado." };

  const telefone = formData.get("telefone") as string;
  const fotoUrl = formData.get("foto_url") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      telefone: telefone || null,
      ...(fotoUrl ? { foto_url: fotoUrl } : {}),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/aluno/perfil");
  revalidatePath("/aluno/dashboard");
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado." };

  const novaSenha = formData.get("nova_senha") as string;
  const confirmarSenha = formData.get("confirmar_senha") as string;

  if (!novaSenha || novaSenha.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  if (novaSenha !== confirmarSenha) {
    return { error: "As senhas não coincidem." };
  }

  const { error } = await supabase.auth.updateUser({ password: novaSenha });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
