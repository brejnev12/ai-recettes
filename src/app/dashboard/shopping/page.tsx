"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RecipeCard = {
  id: string;
  title: string;
};

type RecipeFull = {
  id: string;
  title: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
};

type Item = {
  name: string;
  quantity: string;
  unit: string;
};

export default function ShoppingPage() {
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("recipes")
        .select("id, title")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      setRecipes(data || []);
    };

    fetchRecipes();
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const generate = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: fullRecipes, error } = await supabase
      .from("recipes")
      .select("id, title, ingredients")
      .in("id", selected);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const typedRecipes = fullRecipes as RecipeFull[];

    const allIngredients = typedRecipes.flatMap((r) => r.ingredients || []);

    const items: Item[] = allIngredients.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
    }));

    const { error: insertError } = await supabase
      .from("shopping_lists")
      .insert({
        user_id: user.id,
        recipes: typedRecipes,
        items,
      });

    setLoading(false);

    if (insertError) {
      console.error(insertError);
      alert(insertError.message);
    } else {
      alert("Shopping liste creéé");
    }
  };

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">Shopping Liste</h1>

      <div className="grid gap-3">
        {recipes.map((r) => (
          <div
            key={r.id}
            onClick={() => toggle(r.id)}
            className={`p-4 rounded cursor-pointer border transition ${
              selected.includes(r.id) ? "bg-green-600" : "bg-slate-900"
            }`}
          >
            {r.title}
          </div>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={loading || selected.length === 0}
        className="bg-white text-black px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generation..." : "Generer Shopping List"}
      </button>
    </div>
  );
}
