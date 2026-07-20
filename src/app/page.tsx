import Link from "next/link";
import { Dumbbell, Users, Activity, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-blue-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-teal-300" />
          <span className="text-2xl font-bold text-white">FitManager</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login/personal">
            <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Gerencie seus alunos
          <br />
          <span className="text-teal-300">de forma simples</span>
        </h1>
        <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto mb-10">
          Sistema gratuito para personal trainers organizarem treinos, acompanhar
          evolução física e controlar pagamentos dos alunos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register/personal">
            <Button size="lg" className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white">
              Sou Personal Trainer
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/auth/register/aluno">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10"
            >
              Sou Aluno
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Users className="w-8 h-8 text-teal-600" />,
              title: "Gestão de Alunos",
              desc: "Cadastre e gerencie todos os seus alunos em um só lugar.",
            },
            {
              icon: <Dumbbell className="w-8 h-8 text-teal-600" />,
              title: "Planos de Treino",
              desc: "Crie treinos personalizados com exercícios, séries e cargas.",
            },
            {
              icon: <Activity className="w-8 h-8 text-teal-600" />,
              title: "Acompanhamento",
              desc: "Registre métricas e visualize gráficos de evolução.",
            },
            {
              icon: <CreditCard className="w-8 h-8 text-teal-600" />,
              title: "Pagamentos",
              desc: "Controle mensalidades, vencimentos e status de pagamento.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-teal-100 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Login links */}
      <section className="container mx-auto px-4 py-12 text-center">
        <p className="text-teal-200 mb-4">Já tem uma conta?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/login/personal"
            className="text-teal-300 hover:text-white underline underline-offset-4 transition-colors"
          >
            Login Personal Trainer
          </Link>
          <span className="hidden sm:inline text-teal-600">|</span>
          <Link
            href="/auth/login/aluno"
            className="text-teal-300 hover:text-white underline underline-offset-4 transition-colors"
          >
            Login Aluno
          </Link>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 text-center text-teal-400 text-sm">
        FitManager &copy; {new Date().getFullYear()} — Sistema gratuito para personal trainers
      </footer>
    </div>
  );
}
