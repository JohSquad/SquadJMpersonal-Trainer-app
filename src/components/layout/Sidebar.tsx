"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Dumbbell,
  Activity,
  CreditCard,
  User,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const personalNav: NavItem[] = [
  {
    href: "/personal/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/personal/alunos",
    label: "Alunos",
    icon: <Users className="w-5 h-5" />,
  },
];

const alunoNav: NavItem[] = [
  {
    href: "/aluno/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/aluno/treino",
    label: "Meu Treino",
    icon: <Dumbbell className="w-5 h-5" />,
  },
  {
    href: "/aluno/metricas",
    label: "Métricas",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    href: "/aluno/pagamentos",
    label: "Pagamentos",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    href: "/aluno/perfil",
    label: "Perfil",
    icon: <User className="w-5 h-5" />,
  },
];

interface SidebarProps {
  tipo: "personal" | "aluno";
  userName: string;
}

export function Sidebar({ tipo, userName }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = tipo === "personal" ? personalNav : alunoNav;

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-teal-700">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-teal-300" />
          <div>
            <h1 className="text-lg font-bold text-white">FitManager</h1>
            <p className="text-xs text-teal-300">
              {tipo === "personal" ? "Personal Trainer" : "Aluno"}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-700 text-white"
                  : "text-teal-100 hover:bg-teal-800 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-teal-700">
        <p className="text-sm text-teal-200 mb-3 truncate">{userName}</p>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-teal-200 hover:text-white hover:bg-teal-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-teal-900 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-teal-300" />
          <span className="text-white font-bold">FitManager</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-1"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-40 h-full w-64 bg-teal-900 flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-teal-900 flex-col">
        <NavContent />
      </aside>
    </>
  );
}
