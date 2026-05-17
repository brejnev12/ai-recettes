"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Recipe = {
  id: string;
  title: string;
};

export default function SearchPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async (value: string) => {
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("recipes")
      .select("id, title")
      .eq("user_id", userData.user?.id)
      .ilike("title", `%${value}%`);

    setResults(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">Recherche recette</h1>

      <input
        className="w-full p-3 bg-slate-900 rounded"
        placeholder="Recherche par titre..."
        value={query}
        onChange={(e) => searchRecipes(e.target.value)}
      />

      {loading && <p className="text-slate-400">Searching...</p>}

      <div className="space-y-3">
        {results.map((r) => (
          <div
            key={r.id}
            onClick={() => router.push(`/dashboard/recipes/${r.id}`)}
            className="p-4 bg-slate-900 rounded border border-slate-800 cursor-pointer hover:bg-slate-800 transition"
          >
            {r.title}
          </div>
        ))}
      </div>
    </div>
  );
}
