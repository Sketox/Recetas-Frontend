// src/components/chatbot.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRecipesFromAI } from "@/lib/api";

type APIRecipe = {
  id?: string;
  title?: string;
  titulo?: string;
  description?: string;
  descripcion?: string;
  prepTime?: number;
  prep_time?: number;
  cookTime?: number;
  cook_time?: number;
  difficulty?: string;
  rating?: number;
  category?: string;
  imageUrl?: string;
  ingredientes?: string[];
  instrucciones?: string[];
};

type Recipe = {
  id?: string;
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  difficulty?: string;
  rating?: number;
  category?: string;
  imageUrl?: string;
};

function normalize(r: APIRecipe): Recipe {
  const descFromLists =
    r.ingredientes || r.instrucciones
      ? [
          r.ingredientes ? `Ingredientes: ${r.ingredientes.join(", ")}` : "",
          r.instrucciones
            ? ` Instrucciones: ${r.instrucciones.join(". ")}`
            : "",
        ]
          .join("")
          .trim()
      : undefined;

  return {
    id: r.id,
    title: r.title ?? r.titulo ?? "Receta",
    description: r.description ?? r.descripcion ?? descFromLists,
    prepTime: r.prepTime ?? r.prep_time,
    cookTime: r.cookTime ?? r.cook_time,
    difficulty: r.difficulty,
    rating: r.rating,
    category: r.category,
    imageUrl: r.imageUrl,
  };
}

export default function Chatbot() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Recipe[]>([]);

  const send = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRecipesFromAI(input.trim()); // ← pega al backend
      const normalized = (data as APIRecipe[]).map(normalize).slice(0, 3);
      setResults(normalized);
    } catch {
      setError("No se pudo contactar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const viewRecipe = (r: Recipe) => {
    localStorage.setItem("selectedRecipe", JSON.stringify(r));
    router.push("/recipe_detail"); // ← tu vista de detalle
  };

  return (
    <div className="flex-1 flex flex-col p-3">
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ej: pollo y arroz, 2 porciones…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={send}
          disabled={loading || !input.trim()}
        >
          {loading ? "…" : "Enviar"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <div className="space-y-3 overflow-y-auto pr-1">
        {results.map((r, idx) => {
          const total = (r.prepTime ?? 0) + (r.cookTime ?? 0);
          return (
            <div key={idx} className="border rounded-lg p-3">
              <h4 className="font-semibold">{r.title}</h4>
              {r.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {r.description}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-3">
                <span>⏱ {total} min</span>
                {r.difficulty && <span>📈 {r.difficulty}</span>}
                {typeof r.rating === "number" && <span>⭐ {r.rating}</span>}
                {r.category && <span>🏷 {r.category}</span>}
              </div>
              <button
                className="mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                onClick={() => viewRecipe(r)}
              >
                Ver receta →
              </button>
            </div>
          );
        })}

        {!loading && results.length === 0 && !error && (
          <p className="text-sm text-gray-500">
            Pide 3 ideas: “tortilla sin horno”, “postre con chocolate”, etc.
          </p>
        )}
      </div>
    </div>
  );
}
