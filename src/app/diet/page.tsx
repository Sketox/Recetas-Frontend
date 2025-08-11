"use client";

import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Comida = {
  desayuno: string;
  almuerzo: string;
  merienda: string;
  snack: string;
  cena: string;
};

type DietaData = {
  [dia: string]: Comida;
};

const mockDieta: DietaData = {
  Lunes: {
    desayuno: "Avena con fruta",
    almuerzo: "Pollo con arroz y ensalada",
    merienda: "Yogur natural",
    snack: "Frutas secas",
    cena: "Sopa de verduras",
  },
  Martes: {
    desayuno: "Pan integral con huevo",
    almuerzo: "Pescado al horno con papas",
    merienda: "Batido de frutas",
    snack: "Barra de cereal",
    cena: "Ensalada mixta",
  },
  Miércoles: {
    desayuno: "Smoothie verde",
    almuerzo: "Lentejas con arroz",
    merienda: "Galletas integrales",
    snack: "Manzana",
    cena: "Pollo a la plancha",
  },
  Jueves: {
    desayuno: "Tostadas con aguacate",
    almuerzo: "Carne magra con verduras",
    merienda: "Yogur griego",
    snack: "Nueces",
    cena: "Ensalada César",
  },
  Viernes: {
    desayuno: "Pan de centeno y queso",
    almuerzo: "Pasta integral con atún",
    merienda: "Fruta",
    snack: "Galletas sin azúcar",
    cena: "Omelette de vegetales",
  },
  Sábado: {
    desayuno: "Panqueques integrales",
    almuerzo: "Hamburguesa de lentejas",
    merienda: "Zumo natural",
    snack: "Mix de semillas",
    cena: "Crema de calabaza",
  },
  Domingo: {
    desayuno: "Croissant y café",
    almuerzo: "Asado con ensalada",
    merienda: "Helado light",
    snack: "Frutas deshidratadas",
    cena: "Wrap de pollo",
  },
};

export default function DietPage() {
  const [dieta, setDieta] = useState<DietaData>(mockDieta);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(255, 87, 34);
    doc.text("Tu Dieta Semanal", 14, 20);

    const columns = [
      { header: "Día", dataKey: "dia" },
      { header: "Desayuno", dataKey: "desayuno" },
      { header: "Almuerzo", dataKey: "almuerzo" },
      { header: "Merienda", dataKey: "merienda" },
      { header: "Snack", dataKey: "snack" },
      { header: "Cena", dataKey: "cena" },
    ];

    const rows = Object.entries(dieta).map(([dia, comidas]) => ({
      dia,
      ...comidas,
    }));

    autoTable(doc, {
      startY: 26,
      columns,
      body: rows,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
        textColor: "#333",
      },
      headStyles: {
        fillColor: [255, 237, 213],
        textColor: "#000",
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [255, 250, 240],
      },
    });

    doc.save("dieta.pdf");
  };

  const obtenerDietaIA = async () => {
    if (!input.trim()) return alert("Escribe algo para obtener una dieta recomendada.");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.success && data.dieta) {
        setDieta(data.dieta);
      } else {
        alert("No se pudo obtener una dieta válida.");
      }
    } catch (error) {
      alert("Error al conectar con la IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Tu Dieta Semanal</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe tu dieta actual o lo que buscas..."
        className="w-full p-3 border rounded-lg mb-4"
        rows={4}
      />

      <div className="flex gap-4 mb-6">
        <button
          onClick={obtenerDietaIA}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Generando..." : "Obtener Dieta Recomendada"}
        </button>

        <button
          onClick={() => setDieta(mockDieta)}
          disabled={loading}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:opacity-50"
          title="Restaurar dieta por defecto"
        >
          Restaurar Dieta Inicial
        </button>

        <button
          onClick={exportToPDF}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Descargar PDF
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-md max-h-[400px]">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-orange-100">
              <th className="p-3 border">Día</th>
              <th className="p-3 border">Desayuno</th>
              <th className="p-3 border">Almuerzo</th>
              <th className="p-3 border">Merienda</th>
              <th className="p-3 border">Snack</th>
              <th className="p-3 border">Cena</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dieta).map(([dia, comidas]) => (
              <tr key={dia} className="hover:bg-orange-50">
                <td className="p-3 border font-semibold">{dia}</td>
                <td className="p-3 border">{comidas.desayuno}</td>
                <td className="p-3 border">{comidas.almuerzo}</td>
                <td className="p-3 border">{comidas.merienda}</td>
                <td className="p-3 border">{comidas.snack}</td>
                <td className="p-3 border">{comidas.cena}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
