'use client';

import { useEffect, useState } from "react";

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedRecipe");
    if (stored) setRecipe(JSON.parse(stored));
  }, []);

  if (!recipe) return <p>Cargando receta...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>

      <h2 className="text-xl mt-4">Ingredientes:</h2>
      <ul className="list-disc ml-6">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h2 className="text-xl mt-4">Preparación:</h2>
      <ol className="list-decimal ml-6">
        {recipe.instructions.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
