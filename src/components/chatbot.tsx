"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRecipesFromAI } from "@/lib/api";

type RecipeLike = {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  category: "Desayuno" | "Almuerzo" | "Cena" | "Postre" | "Snack";
  imageUrl: string;
  rating: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecipeLike[]>([]);
  const router = useRouter();

  const send = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const recs = await fetchRecipesFromAI(input.trim());
      setResults((recs ?? []).slice(0, 3));
    } catch (e: any) {
      setError(e?.message || "Error al consultar la IA");
    } finally {
      setLoading(false);
    }
  };

  const viewRecipe = (r: RecipeLike) => {
    localStorage.setItem("selectedRecipe", JSON.stringify(r));
    router.push("/recipe_detail");
  };

  return (
    <div className="flex-1 flex flex-col p-3">
      {/* Entrada */}
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
          disabled={loading}
        >
          {loading ? "…" : "Enviar"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {/* Resultados (3 opciones) */}
      <div className="space-y-3 overflow-y-auto pr-1">
        {results.map((r, idx) => {
          const total = (r.prepTime || 0) + (r.cookTime || 0);
          return (
            <div key={idx} className="border rounded-lg p-3">
              <h4 className="font-semibold">{r.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {r.description}
              </p>
              <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-3">
                <span>⏱ {total} min</span>
                <span>📈 {r.difficulty}</span>
                <span>⭐ {r.rating}</span>
                <span>🏷 {r.category}</span>
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

        {!loading && results.length === 0 && (
          <p className="text-sm text-gray-500">
            Pide 3 ideas: “tortilla sin horno”, “postre con chocolate”, etc.
          </p>
        )}
      </div>
    </div>
  );
}
