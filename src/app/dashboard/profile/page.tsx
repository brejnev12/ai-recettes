"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    id: "",
    fullname: "",
    intolerances: [],
    goal: "energy",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userData.user.id) 
        .single();

      if (data) {
        setProfile({
          id: data.user_id,
          fullname: data.fullname,
          intolerances: data.intolerances,
          goal: data.goal,
        });
      }
    };

    loadProfile();
  }, []);


  const saveProfile = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { error } = await supabase.from("profiles").upsert({
      user_id: userData.user.id, 
      fullname: profile.fullname,
      intolerances: profile.intolerances,
      goal: profile.goal,
    });

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">👤 Profile IA</h1>

    
      <div>
        <label className="text-sm text-slate-400">Full name</label>
        <input
          className="w-full p-3 bg-slate-900 rounded"
          value={profile.fullname || ""}
          onChange={(e) =>
            setProfile({ ...profile, fullname: e.target.value })
          }
        />
      </div>

      
      <div>
        <label className="text-sm text-slate-400">Intolerances</label>
        <input
          className="w-full p-3 bg-slate-900 rounded"
          placeholder="lactose, Sucre"
          value={(profile.intolerances || []).join(", ")}
          onChange={(e) =>
            setProfile({
              ...profile,
              intolerances: e.target.value
                .split(",")
                .map((v) => v.trim()),
            })
          }
        />
      </div>

     
      <div>
        <label className="text-sm text-slate-400">Goal</label>
        <select
          className="w-full p-3 bg-slate-900 rounded"
          value={profile.goal || "energy"}
          onChange={(e) =>
            setProfile({ ...profile, goal: e.target.value })
          }
        >
          <option value="bulk">Prise de masse</option>
          <option value="cut">Perte de poids</option>
          <option value="energy">Énergie</option>
        </select>
      </div>

      <button
        onClick={saveProfile}
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded"
      >
        {loading ? "Savegarde..." : "Savegarde Profil"}
      </button>
    </div>
  );
}