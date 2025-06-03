"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Recipe } from "../../types/recipe";

export default function Home() {
  const [recetas, setRecetas] = useState<Recipe[]>([]);

  useEffect(() => {
    axios
      .get<Recipe[]>("http://localhost:5000/api/recetas")
      .then((res) => setRecetas(res.data))
      .catch((err) => console.error("Error al obtener recetas:", err));
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Lista de Recetas 🍽️</h1>
      {recetas.length === 0 ? (
        <p>No hay recetas aún.</p>
      ) : (
        <ul>
          {recetas.map((receta) => (
            <li key={receta._id}>
              <h3>{receta.titulo}</h3>
              <p>Dificultad: {receta.dificultad}</p>
              <ul>
                {receta.ingredientes.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
