"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        goal: "",
        intolerances: [],
        fullname: "",
      });
    }

    setLoading(false);

    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-slate-800 p-8">
        <h1 className="text-3xl font-bold">Compte</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg bg-slate-900 p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg bg-slate-900 p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full rounded-lg bg-white py-3 font-medium text-black"
        >
          {loading ? "Chargement..." : "Créer un compte"}
        </button>
      </div>
    </main>
  );
}
