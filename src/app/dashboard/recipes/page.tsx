"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Recipe = {
  id: string;
  title: string;
  created_at: string;
};

export default function RecipesPage() {
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async (query: string) => {
    const { data: userData } = await supabase.auth.getUser();

    let queryBuilder = supabase
      .from("recipes")
      .select("id, title, created_at")
      .eq("user_id", userData.user?.id)
      .order("created_at", { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }
    const { data } = await queryBuilder;
    setRecipes(data || []);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchRecipes("");
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      await fetchRecipes(search);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">Mes Recettes</h1>

      <input
        className="w-full p-3 bg-slate-900 rounded"
        placeholder="Recherche..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-slate-400">Loading...</p>}

      <div className="grid gap-4">
        {recipes.map((r) => (
          <div
            key={r.id}
            onClick={() => router.push(`/dashboard/recipes/${r.id}`)}
            className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800"
          >
            <h2 className="text-lg font-semibold">{r.title}</h2>

            <p className="text-sm text-slate-400">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
