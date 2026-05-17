"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menu = [
    { label: "Accueil", path: "/dashboard" },
    { label: "Generer IA", path: "/dashboard/generate" },
    { label: "Recettes", path: "/dashboard/recipes" },
    { label: "Recherche", path: "/dashboard/search" },
    { label: "Shopping", path: "/dashboard/shopping" },
    { label: "Profil", path: "/dashboard/profile" },
  ];


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Vérification utilisateur...
      </div>
    );
  }

 
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-4">
        <h1 className="mb-6 text-xl font-bold">Gestion des recettes</h1>

        <nav className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-8 w-full rounded bg-red-500 px-3 py-2"
        >
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}