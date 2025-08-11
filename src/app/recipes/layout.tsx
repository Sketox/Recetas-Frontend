import { Suspense, ReactNode } from "react";

export default function RecipesLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="p-4">Cargando recetas…</div>}>
      {children}
    </Suspense>
  );
}
