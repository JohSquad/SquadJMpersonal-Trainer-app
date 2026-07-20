import { NextResponse } from "next/server";
import { verificarENotificarPagamentos } from "@/lib/actions/notificacoes";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const resultado = await verificarENotificarPagamentos();

  return NextResponse.json(resultado);
}
