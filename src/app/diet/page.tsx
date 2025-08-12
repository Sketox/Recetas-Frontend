"use client";

import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Meals = {
  desayuno: string;
  snack: string;
  almuerzo: string;
  merienda: string;
  cena: string;
};

type DietMap = Record<string, Meals>;

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const DAYS: Array<keyof DietMap> = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function DietPage() {
  const [diet, setDiet] = useState<DietMap>({} as DietMap);
  const [notes, setNotes] = useState<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const filledDays = useMemo(() => DAYS.filter((d) => diet[d]), [diet]);

  const fetchDiet = async () => {
    const msg = input.trim();
    if (!msg) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/diet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ message: msg }),
        cache: "no-store",
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Respuesta no JSON (${ct}): ${text.slice(0, 120)}`);
      }
      const json = await res.json();

      if (json?.success && json?.diet) {
        setDiet(json.diet as DietMap);
        setNotes(json.notes || "");
        // scroll arriba
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error("No se pudo obtener una dieta válida.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error al conectar con la IA.");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 87, 34);
    doc.text("Plan de Dieta Semanal", 40, 40);

    if (notes) {
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const split = doc.splitTextToSize(`Notas: ${notes}`, 515);
      doc.text(split, 40, 65);
    }

    // Tabla
    const columns = [
      { header: "Día", dataKey: "dia" },
      { header: "Desayuno", dataKey: "desayuno" },
      { header: "Snack", dataKey: "snack" },
      { header: "Almuerzo", dataKey: "almuerzo" },
      { header: "Merienda", dataKey: "merienda" },
      { header: "Cena", dataKey: "cena" },
    ];

    const rows = DAYS.map((d) => ({
      dia: d,
      desayuno: diet[d]?.desayuno || "",
      snack: diet[d]?.snack || "",
      almuerzo: diet[d]?.almuerzo || "",
      merienda: diet[d]?.merienda || "",
      cena: diet[d]?.cena || "",
    }));

    autoTable(doc, {
      head: [columns.map((c) => c.header)],
      body: rows.map((r) => columns.map((c) => (r as any)[c.dataKey])),
      startY: notes ? 90 : 70,
      styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
      headStyles: {
        fillColor: [255, 237, 213],
        textColor: 0,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [255, 250, 240] },
      columnStyles: { 0: { fontStyle: "bold" } },
    });

    doc.save("dieta-semanal.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold text-orange-600">Tu Dieta Semanal</h1>
        {filledDays.length === 7 && (
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Descargar PDF
          </button>
        )}
      </div>

      {/* Entrada del usuario */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe tu objetivo, alergias y preferencias (ej: “bajar grasa, 1800
          kcal, sin lácteos, 3 comidas + snack”)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tu descripción…"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          rows={4}
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={fetchDiet}
            disabled={loading || !input.trim()}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 transition"
          >
            {loading ? "Generando…" : "Obtener dieta"}
          </button>
          <span className="text-xs text-gray-500">
            La IA devuelve exactamente 7 días
          </span>
        </div>
      </div>

      {/* Notas */}
      {notes && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 mb-6">
          <div className="font-semibold mb-1">Notas de la nutrición</div>
          <p className="text-sm">{notes}</p>
        </div>
      )}

      {/* Calendario semanal (tarjetas) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DAYS.map((d) => {
          const m = diet[d] || ({} as Meals);
          return (
            <div key={d} className="bg-white rounded-2xl border shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">{d}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                  Plan
                </span>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    🍳
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500">
                      Desayuno
                    </div>
                    <div className="text-sm text-gray-800">
                      {m.desayuno || "—"}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                    🥨
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500">Snack</div>
                    <div className="text-sm text-gray-800">
                      {m.snack || "—"}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                    🍽️
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500">
                      Almuerzo
                    </div>
                    <div className="text-sm text-gray-800">
                      {m.almuerzo || "—"}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-fuchsia-100 flex items-center justify-center">
                    🫖
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500">
                      Merienda
                    </div>
                    <div className="text-sm text-gray-800">
                      {m.merienda || "—"}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
                    🌙
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500">Cena</div>
                    <div className="text-sm text-gray-800">{m.cena || "—"}</div>
                  </div>
                </li>
              </ul>
            </div>
          );
        })}
      </div>

      {/* Botón extra de PDF al final (si ya hay plan) */}
      {filledDays.length === 7 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={exportToPDF}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Descargar PDF
          </button>
        </div>
      )}
    </div>
  );
}
