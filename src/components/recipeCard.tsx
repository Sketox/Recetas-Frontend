import Image from "next/image";
import { useState, useEffect } from "react";
import { getBackgroundColor } from "@/utils/colorUtils";
import { useFavorites } from "@/hooks/useFavorites";
import { getIconComponent } from "@/utils/IconSelector";

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  time: number;
  difficulty: string;
  rating: number;
  recipeId: string;
  author?: {
    name: string;
    icon: string;
  } | null;
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
  author,
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al modificar favoritos";
      alert(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="relative w-full h-48">
        {imageUrl && imageUrl.trim() !== "" ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full rounded-t-xl flex flex-col items-center justify-center text-white ${getBackgroundColor(title)}`}>
            <div className="text-5xl mb-3">🍽️</div>
            <span className="text-sm font-medium px-2 text-center opacity-90">
              {title.length > 20 ? title.substring(0, 20) + '...' : title}
            </span>
          </div>
        )}
        
        {/* Botón de favoritos mejorado */}
        <button
          onClick={handleToggleFavorite}
          disabled={isToggling}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm ${
            isFavorite 
              ? 'bg-red-500 text-white transform scale-110' 
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110'
          } ${isToggling ? 'opacity-50' : ''}`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center text-gray-500 text-sm gap-4 mb-4">
          <span className="flex items-center gap-1">
            <span className="text-blue-500">⏱</span> {time} min
          </span>
          <span className="flex items-center gap-1">
            <span className="text-orange-500">🔥</span> {difficulty}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span> {rating}
          </span>
        </div>
        
        {/* Información del autor */}
        {author && author.name ? (
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <div className="w-4 h-4 mr-1.5 text-orange-500 flex items-center justify-center">
              {author.icon ? (() => {
                const IconComponent = getIconComponent(author.icon);
                return <IconComponent className="w-4 h-4" />;
              })() : <span>👤</span>}
            </div>
            <span>Subido por {author.name}</span>
          </div>
        ) : (
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <div className="w-4 h-4 mr-1.5 text-orange-500">🏠</div>
            <span>Subidas por Cooksy</span>
          </div>
        )}
        
        <button
          onClick={onViewRecipe}
          className="mt-4 w-full px-4 py-3 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <span>👁</span>
          <span>Ver Receta</span>
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
