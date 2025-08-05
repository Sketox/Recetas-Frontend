import Image from "next/image";
import { useState, useEffect } from "react";
import { getBackgroundColor } from "@/utils/colorUtils";
import { useFavorites } from "@/hooks/useFavorites";

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  time: number;
  difficulty: string;
  rating: number;
  recipeId: string;
  onViewRecipe?: () => void;
}

const RecipeCard = ({
  title,
  description,
  imageUrl,
  time,
  difficulty,
  rating,
  recipeId,
  onViewRecipe,
}: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { checkIfFavorite, toggleFavorite } = useFavorites();

  // Verificar si es favorito al cargar
  useEffect(() => {
    const checkStatus = async () => {
      if (recipeId) {
        const status = await checkIfFavorite(recipeId);
        setIsFavorite(status);
      }
    };
    checkStatus();
  }, [recipeId, checkIfFavorite]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsToggling(true);
    try {
      const newStatus = await toggleFavorite(recipeId, isFavorite);
      setIsFavorite(newStatus);
    } catch (error: any) {
      alert(error.message || "Error al modificar favoritos");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl hover:shadow-md transition">
      <div className="relative w-full h-40">
        {imageUrl && imageUrl.trim() !== "" ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className={`w-full h-full rounded-t-lg flex flex-col items-center justify-center text-white ${getBackgroundColor(title)}`}>
            <div className="text-4xl mb-2">🍽️</div>
            <span className="text-sm font-medium px-2 text-center opacity-90">
              {title.length > 20 ? title.substring(0, 20) + '...' : title}
            </span>
          </div>
        )}
        
        {/* Botón de favoritos */}
        <button
          onClick={handleToggleFavorite}
          disabled={isToggling}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          } ${isToggling ? 'opacity-50' : ''}`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <div className="flex items-center text-gray-400 text-sm gap-4">
          <span>⏱ {time} min</span>
          <span>🔥 {difficulty}</span>
          <span>⭐ {rating}</span>
        </div>
        <button
          onClick={onViewRecipe}
          className="mt-3 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
        >
          👁 Ver Receta
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
