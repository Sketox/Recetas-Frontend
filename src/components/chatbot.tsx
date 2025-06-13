"use client";

import { useState } from "react";
import { fetchRecipesFromAI } from "../lib/api";
import { useRouter } from "next/router";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();

  const handleSend = async () => {
    const res = await fetchRecipesFromAI(input);
    setRecipes(res);
    setInput("");
  };

  const handleViewRecipe = (index) => {
    const recipe = recipes[index];
    // Guardar receta en localStorage para mostrarla en otra página
    localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
    router.push("/recipe-detail");
  };

  return (
    <div>
      <h2>Chatbot de Recetas</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Enviar</button>

      {recipes.map((r, i) => (
        <div key={i}>
          <h3>{r.title}</h3>
          <button onClick={() => handleViewRecipe(i)}>Ver receta</button>
        </div>
      ))}
    </div>
  );
}
