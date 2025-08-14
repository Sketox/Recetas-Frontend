"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEdit, FaCog } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { getIconComponent } from "@/utils/IconSelector";
import ModernIconPicker from "@/components/ModernIconPicker";
import Modal from "@/components/modal";
import EditRecipeForm from "@/components/edit_recipe_form";
import RecipeCard from "@/components/recipeCard";
import { fetchFromBackend } from "@/services/index";
import CreateRecipeForm from "@/components/create_recipe_form";
import useTokenValidation from "@/hooks/useTokenValidation";
import { useFavorites } from "@/hooks/useFavorites";
import { getBackgroundColor } from "@/utils/colorUtils";
import { Recipe } from "@/types/recipe";

interface UserProfile {
  name: string;
  email: string;
  icon?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  useTokenValidation();

  const router = useRouter();
  const { userIcon, logout, setUserIcon } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempUserData, setTempUserData] = useState({ name: "", email: "" });
  const [isSavingIcon, setIsSavingIcon] = useState(false);
  const {
    favoriteRecipes,
    loading: favoritesLoading,
    fetchFavorites,
  } = useFavorites();

  const IconComponent = getIconComponent(userIcon || "user-circle");

  const handleEditRecipe = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setEditModalOpen(true);
  };

  const handleEditProfile = () => {
    setTempUserData({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userProfile) return;

    try {
      await fetchFromBackend("/user/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(tempUserData),
      });

      setUserProfile((prev) => (prev ? { ...prev, ...tempUserData } : null));
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar el perfil");
    }
  };

  const handleSaveIcon = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSavingIcon(true);
    try {
      await fetchFromBackend("/user/me/icon", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ icon: userIcon }),
      });

      if (userProfile) {
        setUserProfile((prev) => (prev ? { ...prev, icon: userIcon } : null));
      }
    } catch (error) {
      console.error("Error al actualizar ícono:", error);
      alert("Error al actualizar el ícono");
    } finally {
      setIsSavingIcon(false);
    }
  };

  const handleRecipeUpdated = async (updatedRecipe: Recipe) => {
    // Actualiza en memoria
    setCreatedRecipes((prev) =>
      prev.map((recipe) => {
        const recipeId = recipe._id || recipe.id;
        const updatedId = updatedRecipe._id || updatedRecipe.id;
        return recipeId === updatedId ? updatedRecipe : recipe;
      })
    );

    setEditModalOpen(false);
    setRecipeToEdit(null);

    // Refresca desde backend
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = await fetchFromBackend("/recipes/my-recipes", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setCreatedRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al refrescar recetas:", error);
      }
    }
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    const confirmDelete = confirm(
      `¿Estás seguro de que quieres eliminar "${recipe.title}"? Esta acción no se puede deshacer.`
    );
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
        headers: { Authorization: `Bearer ${token}` },
      });

      setCreatedRecipes((prev) =>
        prev.filter((r) => (r._id || r.id) !== recipeId)
      );
      alert("Receta eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      alert("Error al eliminar la receta. Inténtalo de nuevo.");
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
    router.push("/recipe_detail");
  };

  // Mis recetas + favoritos
  useEffect(() => {
    const fetchCreatedRecipes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCreatedRecipes([]);
        return;
      }
      try {
        const data = await fetchFromBackend("/recipes/my-recipes", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // Perfil de usuario
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserProfile(null);
        return;
      }
      try {
        const data = await fetchFromBackend("/user/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(data as UserProfile);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative px-4 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-white/50 backdrop-blur-sm">
                <IconComponent className="w-20 h-20 sm:w-24 sm:h-24 text-orange-500" />
              </div>
              <button
                onClick={handleEditProfile}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-orange-200"
                title="Editar perfil"
              >
                <FaCog className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Info usuario */}
            <div className="text-white">
              {isEditingProfile ? (
                <div className="space-y-4 max-w-md mx-auto">
                  <input
                    type="text"
                    value={tempUserData.name}
                    onChange={(e) =>
                      setTempUserData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg text-gray-800 text-center text-2xl font-bold"
                    placeholder="Nombre"
                  />
                  <input
                    type="email"
                    value={tempUserData.email}
                    onChange={(e) =>
                      setTempUserData((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg text-gray-800 text-center"
                    placeholder="Email"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    {userProfile?.name || "Cargando..."}
                  </h1>
                  <p className="text-orange-100 text-lg mb-1">
                    {userProfile?.email || ""}
                  </p>
                  <p className="text-orange-200 text-sm">
                    Miembro desde{" "}
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt).toLocaleDateString(
                          "es-ES"
                        )
                      : ""}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* Configuración */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Personaliza tu perfil
              </h2>
              <p className="text-gray-600">Elige un ícono que te represente</p>
            </div>

            <div className="flex items-center gap-4">
              <ModernIconPicker
                currentIcon={userIcon || "user-circle"}
                onIconSelect={(icon) => setUserIcon(icon)}
                onSave={handleSaveIcon}
                isLoading={isSavingIcon}
              />
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {createdRecipes.length}
                </p>
                <p className="text-gray-600">Recetas creadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {favoriteRecipes.length}
                </p>
                <p className="text-gray-600">Recetas favoritas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">4.8</p>
                <p className="text-gray-600">Rating promedio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Favoritas */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                ❤️
              </span>
              Recetas Favoritas
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {favoriteRecipes.length} recetas
            </span>
          </div>

          {favoritesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
              <span className="ml-3 text-gray-600">Cargando favoritos...</span>
            </div>
          ) : favoriteRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id || recipe.id}
                  recipeId={recipe._id || recipe.id}
                  title={recipe.title}
                  description={recipe.description}
                  imageUrl={recipe.imageUrl}
                  time={(recipe.prepTime || 0) + (recipe.cookTime || 0)}
                  difficulty={recipe.difficulty}
                  rating={recipe.rating}
                  author={recipe.author}
                  onViewRecipe={() => handleViewRecipe(recipe)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💔</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No tienes recetas favoritas
              </h3>
              <p className="text-gray-600 mb-4">
                Explora nuestras recetas y marca las que más te gusten
              </p>
              <button
                onClick={() => router.push("/recipes")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Explorar recetas
              </button>
            </div>
          )}
        </div>

        {/* Mis recetas */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                👨‍🍳
              </span>
              Mis Recetas
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {createdRecipes.length} recetas
            </span>
          </div>

          {createdRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdRecipes.map((recipe) => (
                <div
                  key={recipe._id || recipe.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => handleViewRecipe(recipe)}
                >
                  <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                    {recipe.imageUrl && recipe.imageUrl.trim() !== "" ? (
                      <Image
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex flex-col items-center justify-center text-white ${getBackgroundColor(
                          recipe.title
                        )}`}
                      >
                        <div className="text-4xl mb-2">🍽️</div>
                        <span className="text-sm font-medium px-2 text-center opacity-90">
                          {recipe.title.length > 20
                            ? recipe.title.substring(0, 20) + "..."
                            : recipe.title}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRecipe(recipe);
                        }}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        title="Editar receta"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecipe(recipe);
                        }}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm text-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        title="Eliminar receta"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                      ⏱ {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        🔥 {recipe.difficulty}
                      </span>
                      <span>
                        {recipe.createdAt
                          ? new Date(recipe.createdAt).toLocaleDateString(
                              "es-ES"
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No has creado ninguna receta
              </h3>
              <p className="text-gray-600 mb-4">
                ¡Comparte tus recetas favoritas con la comunidad!
              </p>
              <button
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (token) {
                    setIsModalOpen(true);
                  } else {
                    setShowAuthPrompt(true);
                  }
                }}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Crear mi primera receta
              </button>
      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm relative">
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Inicia sesión para compartir recetas
            </h3>
            <p className="text-gray-600 mb-6">
              Debes estar registrado para poder subir tus recetas.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-100 transition"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      )}

      
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateRecipeForm onRecipeUploaded={() => setIsModalOpen(false)} />
      </Modal>
      {/* Modal editar receta */}
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
