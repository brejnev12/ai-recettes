"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Recipe } from "@/types/recipe";

export default function GeneratePage() {
  const [ingredients, setIngredients] = useState("");
  const [servings, setServings] = useState(2);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [saving, setSaving] = useState(false);

  const generateRecipe = async () => {
    setLoading(true);
    setRecipe(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("User introuvable");

      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          servings,
          userId: userData.user.id,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API ERROR:", text);
        throw new Error("API échouée");
      }

      const data: Recipe = await res.json();
      console.log("Recette générée:", data);
      setRecipe(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur");
      console.error("GENERATION ERREUR:", error);
      alert(error.message);
    }

    setLoading(false);
  };

  const saveRecipe = async () => {
    if (!recipe) return;

    setSaving(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("User introuvable");

      const { data, error } = await supabase
        .from("recipes")
        .insert({
          user_id: userData.user.id,
          title: recipe.title,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          nutrition: recipe.nutrition,
        })
        .select();

      console.log("SAVE DATA:", data);
      console.log("SAVE ERROR:", error);

      if (error) throw error;
      alert("Recipe saved !");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erreur");
      console.error("ENREGISTREMENT ERREUR:", error);
      alert(error.message);
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">🍳 Génération de recette</h1>

      <textarea
        className="w-full rounded bg-slate-900 p-3"
        placeholder="Riz, piment, tomate..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <input
        type="number"
        className="w-full rounded bg-slate-900 p-3"
        value={servings}
        onChange={(e) => setServings(Number(e.target.value))}
      />

      <button
        onClick={generateRecipe}
        className="rounded bg-white px-4 py-2 text-black"
      >
        {loading ? "Generation..." : "Generer"}
      </button>

      {recipe && (
        <div className="space-y-4 rounded bg-slate-900 p-4">
          <h2 className="text-xl font-bold">{recipe.title}</h2>

          <button
            onClick={saveRecipe}
            className="rounded bg-green-500 px-4 py-2"
          >
            {saving ? "Savegarde..." : "recette suavegarder"}
          </button>

          <pre className="text-sm text-slate-300">
            {JSON.stringify(recipe, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}