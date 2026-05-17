import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Générateur de recettes IA",
  description: "Générer des recettes avec l'IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-slate-950 text-white">{children}</body>
    </html>
  );
}
