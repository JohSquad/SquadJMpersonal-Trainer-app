import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { getMeusTreinos } from "@/lib/actions/treinos";
import { DIAS_SEMANA } from "@/types/database";

export default async function AlunoTreinoPage() {
  const treinos = await getMeusTreinos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Plano de Treino</h1>
        <p className="text-gray-500 mt-1">Treinos organizados por dia da semana</p>
      </div>

      {treinos.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-12">
            Seu personal trainer ainda não criou treinos para você.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {DIAS_SEMANA.map((dia, diaIndex) => {
            const treinosDia = treinos.filter((t) => t.dia_semana === diaIndex);
            if (treinosDia.length === 0) return null;

            const isToday = new Date().getDay() === diaIndex;

            return (
              <div key={dia}>
                <h2
                  className={`text-lg font-semibold mb-3 ${isToday ? "text-teal-700" : "text-gray-900"}`}
                >
                  {dia}
                  {isToday && (
                    <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                      Hoje
                    </span>
                  )}
                </h2>

                {treinosDia.map((treino) => (
                  <Card key={treino.id} className="mb-3">
                    <CardHeader>
                      <CardTitle>{treino.nome_treino}</CardTitle>
                      {treino.descricao && (
                        <p className="text-sm text-gray-500">{treino.descricao}</p>
                      )}
                    </CardHeader>

                    {treino.exercicios && treino.exercicios.length > 0 ? (
                      <div className="space-y-3">
                        {treino.exercicios.map((ex: any, indice: number) => (
                          <div
                            key={ex.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {ex.nome_exercicio}
                                </p>
                                {ex.observacoes && (
                                  <p className="text-xs text-gray-500">{ex.observacoes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-4 mt-2 sm:mt-0 text-sm text-gray-600 ml-11 sm:ml-0">
                              <span>
                                <strong>{ex.series}</strong> séries
                              </span>
                              <span>
                                <strong>{ex.repeticoes}</strong> reps
                              </span>
                              {ex.carga && (
                                <span>
                                  <strong>{ex.carga}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Nenhum exercício cadastrado.</p>
                    )}
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
