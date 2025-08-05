import Image from "next/image";

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  time: number;
  difficulty: string;
  rating: number;
  onViewRecipe?: () => void; // ✅ Nuevo
}

const RecipeCard = ({
  title,
  description,
  imageUrl,
  time,
  difficulty,
  rating,
  onViewRecipe,
}: Props) => {
  // 🎨 Array de colores de fondo para tarjetas sin imagen
  const backgroundColors = [
    'bg-gradient-to-br from-orange-400 to-orange-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
    'bg-gradient-to-br from-cyan-400 to-cyan-600',
  ];

  // 🎲 Función para obtener un color basado en el título (consistente)
  const getBackgroundColor = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return backgroundColors[Math.abs(hash) % backgroundColors.length];
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
