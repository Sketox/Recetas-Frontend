import { Recipe } from "../../types/recipe";

async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch("http://localhost:5000/api/recipes", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return res.json();
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Recipes</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-xl p-4 shadow">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h2 className="text-xl font-semibold">{recipe.title}</h2>
            <p className="text-sm text-gray-500">
              {recipe.category} | ⭐ {recipe.rating}
            </p>
            <p className="text-sm mt-2 line-clamp-3">{recipe.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
