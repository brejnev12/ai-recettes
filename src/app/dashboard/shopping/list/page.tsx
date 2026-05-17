"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Item = {
  name: string;
  quantity: string;
  unit: string;
};

export default function ShoppingListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("shopping_lists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      console.log("SHOPPING:", data);

      setItems(data?.items || []);
      setLoading(false);
    };

    fetch();
  }, []);

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">Shopping List</h1>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && (
        <p className="text-slate-400">No shopping list yet</p>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-3 bg-slate-900 rounded">
            {item.name} — {item.quantity} {item.unit}
          </div>
        ))}
      </div>
    </div>
  );
}
