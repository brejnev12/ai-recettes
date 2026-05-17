"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Recipe } from "@/types/recipe";

export default function RecipeDetailPage() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setRecipe(data as Recipe);
      } else {
        console.error("FETCH ERROR:", error);
        setRecipe(null);
      }

      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <p className="text-white p-6">Chargement recette...</p>;
  }

  if (!recipe) {
    return <p className="text-white p-6">Recette introuvable </p>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-white p-6">
      <h1 className="text-3xl font-bold">{recipe.title}</h1>

      <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-900 p-4">
        <div>Calories: {recipe.nutrition.calories}</div>
        <div>Proteins: {recipe.nutrition.proteins}g</div>
        <div>Carbs: {recipe.nutrition.carbs}g</div>
        <div>Fat: {recipe.nutrition.fat}g</div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">Ingredients</h2>

        <ul className="list-disc pl-6 text-slate-300 space-y-1">
          {recipe.ingredients?.length ? (
            recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-white font-medium">
                  {ing.quantity} {ing.unit}
                </span>
                <span className="text-slate-300">{ing.name}</span>
              </li>
            ))
          ) : (
            <p className="text-slate-500">No ingredients</p>
          )}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">Steps</h2>

        <ol className="list-decimal pl-6 text-slate-300 space-y-2">
          {recipe.steps?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
