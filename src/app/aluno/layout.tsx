import { Sidebar } from "@/components/layout/Sidebar";
import { getCurrentProfile } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile || profile.tipo !== "aluno") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar tipo="aluno" userName={profile.nome} />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
