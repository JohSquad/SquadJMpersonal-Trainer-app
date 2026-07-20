export type UserType = "personal" | "aluno";

export type PaymentStatus = "pago" | "pendente" | "atrasado";

export interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  telefone: string | null;
  data_nascimento: string | null;
  foto_url: string | null;
  personal_id: string | null;
  codigo_convite: string | null;
  created_at: string;
}

export interface Metrica {
  id: string;
  aluno_id: string;
  peso: number;
  altura: number;
  imc: number;
  percentual_gordura: number | null;
  data_registro: string;
}

export interface Treino {
  id: string;
  aluno_id: string;
  nome_treino: string;
  descricao: string | null;
  dia_semana: number;
  criado_em: string;
  exercicios?: Exercicio[];
}

export interface Exercicio {
  id: string;
  treino_id: string;
  nome_exercicio: string;
  series: number;
  repeticoes: string;
  carga: string | null;
  observacoes: string | null;
  ordem: number;
}

export interface Pagamento {
  id: string;
  aluno_id: string;
  valor: number;
  status: PaymentStatus;
  data_vencimento: string;
  data_pagamento: string | null;
  observacoes: string | null;
  created_at: string;
}

export const DIAS_SEMANA = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

export function calcularIMC(peso: number, alturaCm: number): number {
  const alturaM = alturaCm / 100;
  return Math.round((peso / (alturaM * alturaM)) * 100) / 100;
}

export function gerarCodigoConvite(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case "pago":
      return "bg-emerald-100 text-emerald-800";
    case "pendente":
      return "bg-amber-100 text-amber-800";
    case "atrasado":
      return "bg-red-100 text-red-800";
  }
}
