import RecipesWrapper from "@/components/RecipesWrapper";

// 🚀 Forzar renderizado dinámico (no estático)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <RecipesWrapper />
    </main>
  );
}
