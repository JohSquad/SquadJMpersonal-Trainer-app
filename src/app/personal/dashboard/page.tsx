import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCurrentProfile } from "@/lib/actions/auth";
import { getAlunos, getAlunoStats } from "@/lib/actions/alunos";
import { CopyInviteCode } from "@/components/personal/CopyInviteCode";

export default async function PersonalDashboardPage() {
  const profile = await getCurrentProfile();
  const alunos = await getAlunos();

  const alunosComStats = await Promise.all(
    alunos.map(async (aluno) => {
      const stats = await getAlunoStats(aluno.id);
      return { ...aluno, ...stats };
    })
  );

  const totalPendentes = alunosComStats.reduce(
    (acc, a) => acc + a.pagamentosPendentes,
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Olá, {profile?.nome?.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 mt-1">Gerencie seus alunos e acompanhe o progresso</p>
        </div>
        <Link href="/personal/alunos/novo">
          <Button>
            <Plus className="w-4 h-4" />
            Novo Aluno
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{alunos.length}</p>
              <p className="text-sm text-gray-500">Alunos ativos</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPendentes}</p>
              <p className="text-sm text-gray-500">Pagamentos pendentes</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <CopyInviteCode codigo={profile?.codigo_convite || ""} />
        </Card>
      </div>

      {/* Students list */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Alunos</CardTitle>
          <CardDescription>
            {alunos.length === 0
              ? "Nenhum aluno cadastrado ainda."
              : `${alunos.length} aluno(s) cadastrado(s)`}
          </CardDescription>
        </CardHeader>

        {alunos.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Comece cadastrando seu primeiro aluno ou compartilhe seu código de convite.
            </p>
            <Link href="/personal/alunos/novo">
              <Button>
                <Plus className="w-4 h-4" />
                Cadastrar Aluno
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Nome</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 hidden md:table-cell">Telefone</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Peso</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Pagamentos</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosComStats.map((aluno) => (
                  <tr key={aluno.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{aluno.nome}</td>
                    <td className="py-3 px-2 text-gray-500 hidden sm:table-cell">{aluno.email}</td>
                    <td className="py-3 px-2 text-gray-500 hidden md:table-cell">
                      {aluno.telefone || "—"}
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {aluno.ultimaMetrica
                        ? `${aluno.ultimaMetrica.peso} kg`
                        : "—"}
                    </td>
                    <td className="py-3 px-2">
                      {aluno.pagamentosPendentes > 0 ? (
                        <Badge variant="warning">
                          {aluno.pagamentosPendentes} pendente(s)
                        </Badge>
                      ) : (
                        <Badge variant="success">Em dia</Badge>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/personal/alunos/${aluno.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver perfil
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
