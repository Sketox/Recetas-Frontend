"use client";

import { Suspense } from "react";
import RecipesContent from "@/components/RecipesContent";

// Componente de loading para el Suspense boundary
function RecipesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4 mx-auto max-w-md"></div>
        <div className="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-12 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Suspense fallback={<RecipesLoading />}>
        <RecipesContent />
      </Suspense>
    </main>
  );
}
