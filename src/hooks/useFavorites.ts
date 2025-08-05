import { useState, useCallback } from 'react';
import { fetchFromBackend } from '@/services/index';

export interface Recipe {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  [key: string]: any;
}

export const useFavorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No hay token, no se cargan favoritos");
      setFavoriteRecipes([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchFromBackend<Recipe[]>("/favorites", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("❤️ Recetas favoritas:", data);
      setFavoriteRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      setFavoriteRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkIfFavorite = useCallback(async (recipeId: string): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetchFromBackend<{isFavorite: boolean}>(`/favorites/check/${recipeId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.isFavorite;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  }, []);

  const toggleFavorite = useCallback(async (recipeId: string, isFavorite: boolean): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Debes iniciar sesión para agregar favoritos");
    }

    try {
      if (isFavorite) {
        await fetchFromBackend(`/favorites/${recipeId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Actualizar la lista de favoritos localmente
        setFavoriteRecipes(prev => prev.filter(recipe => 
          (recipe._id || recipe.id) !== recipeId
        ));
        
        return false;
      } else {
        await fetchFromBackend("/favorites", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId }),
        });
        
        // Refrescar la lista de favoritos
        fetchFavorites();
        
        return true;
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }, [fetchFavorites]);

  return {
    favoriteRecipes,
    loading,
    fetchFavorites,
    checkIfFavorite,
    toggleFavorite,
  };
};
