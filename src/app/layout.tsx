import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitManager - Gerenciamento para Personal Trainers",
  description:
    "Sistema gratuito para personal trainers gerenciarem seus alunos, treinos, métricas e pagamentos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
