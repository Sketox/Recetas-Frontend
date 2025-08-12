"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { fetchRecipesFromAI } from "@/lib/api"; // api.js

// cambios sólo en los tipos y normalize()
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
  ingredients?: string[];
  instructions?: string[];
  createdAt?: string;
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
  ingredients?: string[]; // 👈 añade
  instructions?: string[]; // 👈 añade
  createdAt?: string;
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

  const ingredients = Array.isArray(r.ingredients)
    ? r.ingredients
    : Array.isArray(r.ingredientes)
    ? r.ingredientes
    : [];

  const instructions = Array.isArray(r.instructions)
    ? r.instructions
    : Array.isArray(r.instrucciones)
    ? r.instrucciones
    : [];

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
    ingredients, // 👈 guarda en el objeto
    instructions, // 👈 guarda en el objeto
    createdAt: r.createdAt,
  };
}

type Msg =
  | { role: "user"; text: string }
  | { role: "assistant"; text?: string; recipes?: Recipe[]; typing?: boolean };

export default function Chatbot() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // para portal
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Bonjour 👨‍🍳 Soy tu Chef Assistant. Dime qué tienes en la despensa y te doy 3 ideas rápidas.",
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;

    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", typing: true },
    ]);
    setInput("");
    setBusy(true);

    try {
      const data = (await fetchRecipesFromAI(text)) as APIRecipe[];
      const normalized = data.map(normalize).slice(0, 3);

      setMessages((m) => {
        const copy = [...m];
        const i = copy.findIndex(
          (x) => x.role === "assistant" && (x as any).typing
        );
        if (i >= 0) {
          copy[i] = {
            role: "assistant",
            text: "Voilà, trois idées para ti ✨",
            recipes: normalized,
          };
        } else {
          copy.push({
            role: "assistant",
            text: "Voilà, tres ideas ✨",
            recipes: normalized,
          });
        }
        return copy;
      });
    } catch (e: any) {
      setMessages((m) => [
        ...m.filter((x) => !(x.role === "assistant" && (x as any).typing)),
        {
          role: "assistant",
          text: `Ups, no pude contactar a la cocina (${
            e?.message || "error"
          }).`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const viewRecipe = (r: Recipe) => {
    localStorage.setItem("selectedRecipe", JSON.stringify(r));
    router.push("/recipe_detail");
  };

  const ui = (
    <>
      {/* Botón flotante (único) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[9999] rounded-full shadow-xl bg-orange-500 text-white w-14 h-14 text-2xl flex items-center justify-center"
          aria-label="Abrir chat"
        >
          💬
        </button>
      )}

      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[9999] w-[92vw] max-w-[380px] h-[70vh] max-h-[640px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-14 px-4 flex items-center justify-between bg-gradient-to-r from-orange-500 to-pink-500 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">👨‍🍳</span>
              <div className="leading-tight">
                <div className="font-semibold">Chef Assistant</div>
                <div className="text-xs opacity-90">
                  Online • 3 recetas por respuesta
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/90 hover:text-white"
            >
              ✖
            </button>
          </div>

          {/* Mensajes */}
          <div
            ref={listRef}
            className="flex-1 p-3 space-y-3 overflow-y-auto bg-gray-50"
          >
            {messages.map((m, i) => {
              if (m.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] bg-blue-600 text-white px-3 py-2 rounded-2xl rounded-br-sm">
                      {m.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100">
                    👨‍🍳
                  </div>
                  <div className="max-w-[80%]">
                    <div className="bg-white border px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm">
                      {m.typing ? (
                        <span className="inline-flex gap-1">
                          <span className="animate-pulse">•</span>
                          <span className="animate-pulse [animation-delay:150ms]">
                            •
                          </span>
                          <span className="animate-pulse [animation-delay:300ms]">
                            •
                          </span>
                        </span>
                      ) : (
                        m.text
                      )}
                    </div>

                    {m.recipes?.length ? (
                      <div className="mt-2 space-y-2">
                        {m.recipes.map((r, idx) => {
                          const total = (r.prepTime ?? 0) + (r.cookTime ?? 0);
                          return (
                            <div
                              key={idx}
                              className="bg-white border rounded-xl p-3 shadow-sm"
                            >
                              <div className="font-semibold">{r.title}</div>
                              {r.description && (
                                <div className="text-sm text-gray-600 line-clamp-2">
                                  {r.description}
                                </div>
                              )}
                              <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-3">
                                <span>⏱ {total} min</span>
                                {r.difficulty && <span>📈 {r.difficulty}</span>}
                                {typeof r.rating === "number" && (
                                  <span>⭐ {r.rating}</span>
                                )}
                                {r.category && <span>🏷 {r.category}</span>}
                              </div>
                              <button
                                className="mt-2 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                                onClick={() => viewRecipe(r)}
                              >
                                Ver receta →
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Ej: tengo 2 papas y una lata de atún…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={busy}
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white disabled:opacity-50"
              >
                {busy ? "…" : "Enviar"}
              </button>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              El chef responde con exactamente 3 recetas.
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Portal para evitar que algún contenedor con overflow/stacking lo tape
  if (!mounted) return null;
  return createPortal(ui, document.body);
}
