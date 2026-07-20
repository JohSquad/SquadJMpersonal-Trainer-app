import { getCurrentProfile } from "@/lib/actions/auth";
import { PerfilForm } from "@/components/aluno/PerfilForm";
import { redirect } from "next/navigation";

export default async function AlunoPerfilPage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/");

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-500 mt-1">Edite seus dados pessoais</p>
      </div>

      <PerfilForm profile={profile} />
    </div>
  );
}
