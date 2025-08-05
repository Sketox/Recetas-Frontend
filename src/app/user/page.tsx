"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { getIconComponent } from "@/utils/IconSelector";
import IconPicker from "@/components/IconPicker";
import Modal from "@/components/modal";
import EditRecipeForm from "@/components/edit_recipe_form";
import { fetchFromBackend } from "@/services/index";
import useTokenValidation from "@/hooks/useTokenValidation";
import { useFavorites } from "@/hooks/useFavorites";
import { getBackgroundColor } from "@/utils/colorUtils";


interface UserProfile {
  name: string;
  email: string;
}

export default function ProfilePage() {
  useTokenValidation();
  
  const router = useRouter();
  const { userIcon, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const { favoriteRecipes, loading: favoritesLoading, fetchFavorites } = useFavorites();

  const handleEditRecipe = (recipe: any) => {
    setRecipeToEdit(recipe);
    setEditModalOpen(true);
  };

  const handleRecipeUpdated = async (updatedRecipe: any) => {
    console.log("🔄 Actualizando receta en lista:", updatedRecipe);
    
    // Actualizar la lista de recetas creadas
    setCreatedRecipes(prev => prev.map(recipe => {
      const recipeId = recipe._id || recipe.id;
      const updatedId = updatedRecipe._id || updatedRecipe.id;
      
      if (recipeId === updatedId) {
        console.log("✅ Receta encontrada y actualizada:", updatedRecipe);
        return updatedRecipe;
      }
      return recipe;
    }));
    
    // Cerrar el modal
    setEditModalOpen(false);
    setRecipeToEdit(null);
    
    // Refrescar las recetas desde el backend para asegurar que tenemos la versión más reciente
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = await fetchFromBackend("/recipes/my-recipes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("🔄 Recetas refrescadas desde backend:", data);
        setCreatedRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al refrescar recetas:", error);
      }
    }
  };

  const handleDeleteRecipe = async (recipe: any) => {
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar "${recipe.title}"? Esta acción no se puede deshacer.`);
    
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para eliminar recetas");
      return;
    }

    try {
      const recipeId = recipe._id || recipe.id;
      await fetchFromBackend(`/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Receta eliminada exitosamente");
      // Actualizar la lista de recetas creadas
      setCreatedRecipes(prev => prev.filter(r => (r._id || r.id) !== recipeId));
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      alert("Error al eliminar la receta. Inténtalo de nuevo.");
    }
  };

  const handleViewRecipe = (recipe: any) => {
    localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
    router.push("/recipe_detail");
  };

  const IconComponent = getIconComponent(userIcon || "user-circle");

  useEffect(() => {
    const fetchCreatedRecipes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No hay token, no se cargan recetas creadas");
        setCreatedRecipes([]);
        return;
      }

      try {
        const data = await fetchFromBackend("/recipes/my-recipes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📦 Recetas creadas:", data);
        setCreatedRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener recetas creadas:", error);
        setCreatedRecipes([]);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchCreatedRecipes();
      fetchFavorites();
    }
  }, [fetchFavorites]);

  

useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("🔐 Token:", token);

      if (!token) {
        console.log("No hay token, no se carga perfil");
        setUserProfile(null);
        return;
      }

      try {
        const data = await fetchFromBackend("/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📦 Respuesta del backend:", data);
        setUserProfile(data as UserProfile);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, []);


  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <section className="relative bg-[#FF8C42] h-48 sm:h-60 flex items-end justify-center">
        <div className="absolute -bottom-16 sm:-bottom-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
          <IconComponent className="w-25 h-25 text-orange-400" />
        </div>
      </section>

      <section className="pt-20 sm:pt-24 pb-8 text-center bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {userProfile?.name || "Cargando..."}
        </h1>
        <p className="text-gray-700 text-md mt-2">
          {userProfile?.email || ""}
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Selecciona tu ícono:</h3>
          <IconPicker />
        </div>

        <button
          onClick={logout}
          className="mt-6 bg-red-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-red-600 transition-colors shadow-md"
        >
          Cerrar sesión
        </button>
      </section>

      <section className="bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recetas Favoritas</h2>
        {favoritesLoading ? (
          <p className="text-gray-500 text-center">Cargando favoritos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoriteRecipes.length > 0 ? (
              favoriteRecipes.map((recipe) => (
                <div 
                  key={recipe._id || recipe.id} 
                  className="border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewRecipe(recipe)}
                >
                  <div className="w-full h-32 rounded-t-lg flex items-center justify-center">
                    {recipe.imageUrl && recipe.imageUrl.trim() !== "" ? (
                      <Image src={recipe.imageUrl} alt={recipe.title} width={200} height={128} className="object-cover w-full h-full rounded-t-lg" />
                    ) : (
                      <div className={`w-full h-full rounded-t-lg flex flex-col items-center justify-center text-white ${getBackgroundColor(recipe.title)}`}>
                        <div className="text-3xl mb-1">🍽️</div>
                        <span className="text-xs font-medium px-2 text-center opacity-90">
                          {recipe.title.length > 15 ? recipe.title.substring(0, 15) + '...' : recipe.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-lg">{recipe.title}</h3>
                    <p className="text-gray-500 text-sm">{recipe.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No tienes recetas favoritas aún.</p>
            )}
          </div>
        )}
      </section>

      <section className="bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recetas Creadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {createdRecipes.length > 0 ? (
            createdRecipes.map((recipe) => (
              <div 
                key={recipe._id || recipe.id} 
                className="border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewRecipe(recipe)}
              >
                <div className="w-full h-32 rounded-t-lg flex items-center justify-center relative">
                  {recipe.imageUrl && recipe.imageUrl.trim() !== "" ? (
                    <Image src={recipe.imageUrl} alt={recipe.title} width={200} height={128} className="object-cover w-full h-full rounded-t-lg" />
                  ) : (
                    <div className={`w-full h-full rounded-t-lg flex flex-col items-center justify-center text-white ${getBackgroundColor(recipe.title)}`}>
                      <div className="text-3xl mb-1">🍽️</div>
                      <span className="text-xs font-medium px-2 text-center opacity-90">
                        {recipe.title.length > 15 ? recipe.title.substring(0, 15) + '...' : recipe.title}
                      </span>
                    </div>
                  )}
                  
                  {/* Botones de acción */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRecipe(recipe);
                      }}
                      className="bg-blue-500 text-white rounded-full p-1 shadow hover:bg-blue-600 transition-colors"
                      title="Editar receta"
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecipe(recipe);
                      }}
                      className="bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                      title="Eliminar receta"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg">{recipe.title}</h3>
                  <p className="text-gray-500 text-sm">{recipe.description}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    Creada: {new Date(recipe.createdAt).toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No has creado ninguna receta aún.</p>
          )}
        </div>
      </section>

      {/* Modal para editar receta */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <EditRecipeForm 
          recipe={recipeToEdit}
          onRecipeUpdated={handleRecipeUpdated}
          onClose={() => setEditModalOpen(false)}
        />
      </Modal>
    </main>
  );
}
