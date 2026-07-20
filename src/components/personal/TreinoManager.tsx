"use client";

import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { createTreino, updateTreino, deleteTreino } from "@/lib/actions/treinos";
import { DIAS_SEMANA } from "@/types/database";
import type { Treino } from "@/types/database";

interface ExercicioInput {
  nome_exercicio: string;
  series: number;
  repeticoes: string;
  carga: string;
  observacoes: string;
}

interface TreinoManagerProps {
  alunoId: string;
  treinos: Treino[];
}

export function TreinoManager({ alunoId, treinos }: TreinoManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [exercicios, setExercicios] = useState<ExercicioInput[]>([
    { nome_exercicio: "", series: 3, repeticoes: "12", carga: "", observacoes: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const diaOptions = DIAS_SEMANA.map((dia, i) => ({
    value: String(i),
    label: dia,
  }));

  function addExercicio() {
    setExercicios([
      ...exercicios,
      { nome_exercicio: "", series: 3, repeticoes: "12", carga: "", observacoes: "" },
    ]);
  }

  function removeExercicio(index: number) {
    setExercicios(exercicios.filter((_, i) => i !== index));
  }

  function updateExercicio(index: number, field: keyof ExercicioInput, value: string | number) {
    const updated = [...exercicios];
    updated[index] = { ...updated[index], [field]: value };
    setExercicios(updated);
  }

  function startEdit(treino: Treino) {
    setEditingId(treino.id);
    setShowForm(true);
    setExercicios(
      treino.exercicios?.map((ex) => ({
        nome_exercicio: ex.nome_exercicio,
        series: ex.series,
        repeticoes: ex.repeticoes,
        carga: ex.carga || "",
        observacoes: ex.observacoes || "",
      })) || [
        { nome_exercicio: "", series: 3, repeticoes: "12", carga: "", observacoes: "" },
      ]
    );
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setExercicios([
      { nome_exercicio: "", series: 3, repeticoes: "12", carga: "", observacoes: "" },
    ]);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("exercicios", JSON.stringify(exercicios.filter((ex) => ex.nome_exercicio)));

    const result = editingId
      ? await updateTreino(editingId, alunoId, formData)
      : await createTreino(alunoId, formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      resetForm();
      window.location.reload();
    }
  }

  async function handleDelete(treinoId: string) {
    if (confirm("Deseja excluir este treino?")) {
      await deleteTreino(treinoId, alunoId);
      window.location.reload();
    }
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Novo Treino
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Treino" : "Novo Treino"}</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome do treino"
                name="nome_treino"
                required
                placeholder="Ex: Treino A - Peito e Tríceps"
                defaultValue={
                  editingId
                    ? treinos.find((t) => t.id === editingId)?.nome_treino
                    : ""
                }
              />
              <Select
                label="Dia da semana"
                name="dia_semana"
                options={diaOptions}
                defaultValue={
                  editingId
                    ? String(treinos.find((t) => t.id === editingId)?.dia_semana)
                    : "1"
                }
              />
            </div>
            <Textarea
              label="Descrição"
              name="descricao"
              placeholder="Observações gerais sobre o treino..."
              defaultValue={
                editingId
                  ? treinos.find((t) => t.id === editingId)?.descricao || ""
                  : ""
              }
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Exercícios</h4>
                <Button type="button" variant="outline" size="sm" onClick={addExercicio}>
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>

              {exercicios.map((ex, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <Input
                    placeholder="Exercício"
                    value={ex.nome_exercicio}
                    onChange={(e) =>
                      updateExercicio(index, "nome_exercicio", e.target.value)
                    }
                    className="sm:col-span-2"
                  />
                  <Input
                    placeholder="Séries"
                    type="number"
                    value={ex.series}
                    onChange={(e) =>
                      updateExercicio(index, "series", parseInt(e.target.value))
                    }
                  />
                  <Input
                    placeholder="Reps"
                    value={ex.repeticoes}
                    onChange={(e) =>
                      updateExercicio(index, "repeticoes", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Carga"
                    value={ex.carga}
                    onChange={(e) => updateExercicio(index, "carga", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercicio(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
            )}

            <div className="flex gap-2">
              <Button type="submit" loading={loading}>
                {editingId ? "Salvar Alterações" : "Criar Treino"}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Treinos list grouped by day */}
      {treinos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum treino cadastrado.</p>
      ) : (
        <div className="space-y-4">
          {DIAS_SEMANA.map((dia, diaIndex) => {
            const treinosDia = treinos.filter((t) => t.dia_semana === diaIndex);
            if (treinosDia.length === 0) return null;

            return (
              <div key={dia}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{dia}</h3>
                {treinosDia.map((treino) => (
                  <Card key={treino.id} className="mb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{treino.nome_treino}</h4>
                        {treino.descricao && (
                          <p className="text-sm text-gray-500 mt-1">{treino.descricao}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(treino)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(treino.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {treino.exercicios && treino.exercicios.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 font-medium text-gray-500">Exercício</th>
                              <th className="text-left py-2 font-medium text-gray-500">Séries</th>
                              <th className="text-left py-2 font-medium text-gray-500">Reps</th>
                              <th className="text-left py-2 font-medium text-gray-500">Carga</th>
                            </tr>
                          </thead>
                          <tbody>
                            {treino.exercicios.map((ex) => (
                              <tr key={ex.id} className="border-b border-gray-100">
                                <td className="py-2">{ex.nome_exercicio}</td>
                                <td className="py-2">{ex.series}</td>
                                <td className="py-2">{ex.repeticoes}</td>
                                <td className="py-2">{ex.carga || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
