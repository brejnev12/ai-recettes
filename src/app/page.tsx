import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold">Gestion de recettes de cuisine</h1>

        <p className="text-slate-400">Analyse nutritionnelle avec AI</p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-white px-6 py-3 text-black"
          >
            Se connecter
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-slate-700 px-6 py-3"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
