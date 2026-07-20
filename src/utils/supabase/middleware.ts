import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (user && path.startsWith("/auth")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tipo")
      .eq("id", user.id)
      .single();

    if (profile?.tipo === "personal") {
      return NextResponse.redirect(
        new URL("/personal/dashboard", request.url)
      );
    }
    if (profile?.tipo === "aluno") {
      return NextResponse.redirect(new URL("/aluno/dashboard", request.url));
    }
  }

  if (path.startsWith("/personal") || path.startsWith("/aluno")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("tipo")
      .eq("id", user.id)
      .single();

    if (path.startsWith("/personal") && profile?.tipo !== "personal") {
      return NextResponse.redirect(new URL("/aluno/dashboard", request.url));
    }
    if (path.startsWith("/aluno") && profile?.tipo !== "aluno") {
      return NextResponse.redirect(
        new URL("/personal/dashboard", request.url)
      );
    }
  }

  return supabaseResponse;
}
