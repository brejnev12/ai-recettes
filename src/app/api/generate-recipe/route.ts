import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import type { Recipe } from "@/types/recipe";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function safeParse(text: string): Recipe {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Format Json OpenAI invalide");
    return JSON.parse(match[0]);
  }
}

export async function POST(req: Request) {
  try {
    const { ingredients, servings, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId absent" }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("PROFILE ERROR:", profileError.message);
    }

    const intolerances = profile?.intolerances?.join(", ") || "none";
    const goal = profile?.goal || "energy";
    const prompt = `Tu es un chef cuisinier expert.

IMPORTANT:
- Réponds UNIQUEMENT en JSON valide
- Aucun texte hors JSON
- Réponds en français

PROFIL:
- Objectif: ${goal}
- Intolérances: ${intolerances}

RECETTE:
- ${servings} personnes
- ingrédients: ${ingredients}

FORMAT EXACT:
{
  "title": "string",
  "ingredients": [
    {
      "name": "string",
      "quantity": "string",
      "unit": "string"
    }
  ],
  "steps": ["string"],
  "nutrition": {
    "calories": number,
    "proteins": number,
    "carbs": number,
    "fat": number
  }
}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "Tu es un chef IA. Tu réponds uniquement en JSON valide.",
        },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices[0].message.content;

    if (!text) {
      return NextResponse.json(
        { error: "Reponse vide pour AI" },
        { status: 500 },
      );
    }

    const recipe: Recipe = safeParse(text);

    return NextResponse.json(recipe);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error";
    console.error("ERROR API:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
