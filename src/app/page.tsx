import Navbar from "../components/navbar";
import Hero from "../components/hero";
import RecipeCard from "../components/recipeCard";
import CategoryCard from "../components/category";
import CTA from "../components/CTA";

const mockRecipes = [
  {
    title: "Paella Valenciana",
    description:
      "El plato más internacional de la cocina española, originario de Valencia.",
    imageUrl: "/images/paella.jpg",
    time: 55,
    difficulty: "Media",
    rating: 4.9,
  },
  {
    title: "Croquetas de Jamón",
    description:
      "Tapa española por excelencia, cremosas por dentro y crujientes por fuera.",
    imageUrl: "/images/croquetas.jpg",
    time: 50,
    difficulty: "Fácil",
    rating: 4.7,
  },
  // Agrega más recetas si deseas
];

const categories = [
  { icon: "🥐", name: "Desayuno", count: 1 },
  { icon: "🍴", name: "Almuerzo", count: 13 },
  { icon: "🍝", name: "Cena", count: 0 },
  { icon: "🍰", name: "Postre", count: 5 },
  { icon: "🍪", name: "Snack", count: 1 },
];

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recetas Destacadas</h2>
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Ver todas →
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockRecipes.map((r, i) => (
            <RecipeCard key={i} {...r} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">Categorías</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <CategoryCard key={i} {...c} />
          ))}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <CTA />
      </div>
    </div>
  );
}
