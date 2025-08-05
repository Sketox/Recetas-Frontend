"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFromBackend } from "@/services/index";

interface Recipe {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function RecipeCarousel() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const recipes = await fetchFromBackend<Recipe[]>("/recipes", {
          method: "GET",
        });
        
        // Tomar las primeras 4 recetas que tengan imagen
        const recipesWithImages = recipes.filter(recipe => 
          recipe.imageUrl && recipe.imageUrl.trim() !== ""
        ).slice(0, 4);
        
        setFeaturedRecipes(recipesWithImages);
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
      }
    };

    fetchFeaturedRecipes();
  }, []);

  const handleViewRecipe = (recipe: Recipe) => {
    localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
    router.push("/recipe_detail");
  };

  if (featuredRecipes.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-2">
        <div className="bg-gray-200 rounded-lg h-[220px] md:h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Cargando recetas destacadas...</p>
        </div>
      </section>
    );
  }
  return (
    <section className="max-w-7xl mx-auto px-4 py-2">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="rounded-lg overflow-hidden"
      >
        {featuredRecipes.map((recipe, i) => (
          <SwiperSlide key={recipe.id || recipe._id || i}>
            <div className="relative w-full h-[220px] md:h-[300px]">
              {/* Imagen */}
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30"></div>
              {/* Texto y botón */}
              <div className="absolute bottom-6 left-6 z-10">
                <h2 className="text-white text-2xl font-bold mb-2">
                  {recipe.title}
                </h2>
                <p className="text-white/90 text-sm mb-3 max-w-md">
                  {recipe.description.length > 100 
                    ? recipe.description.substring(0, 100) + '...' 
                    : recipe.description}
                </p>
                <button 
                  onClick={() => handleViewRecipe(recipe)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Ver Receta →
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
