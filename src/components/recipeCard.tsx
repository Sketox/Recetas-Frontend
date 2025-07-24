import Image from "next/image";

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  time: number; // tiempo total
  prepTime?: number;
  cookTime?: number;
  difficulty: string;
  rating: number;
}

const RecipeCard = ({
  title,
  description,
  imageUrl,
  time,
  prepTime,
  cookTime,
  difficulty,
  rating,
}: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-xl hover:shadow-md transition">
      <div className="relative w-full h-40">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
          <div className="flex items-center text-gray-400 text-sm gap-4">
            <span>
              ⏱ {time} min
              {prepTime !== undefined && cookTime !== undefined && (
                <span className="text-xs text-gray-500 ml-1">
                  (Prep: {prepTime} | Cocción: {cookTime})
                </span>
              )}
            </span>
            <span>🔥 {difficulty}</span>
            <span>⭐ {rating}</span>
          </div>

        <button className="mt-3 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
          👁 Ver Receta
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
