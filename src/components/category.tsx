import { ReactNode } from "react";

interface CategoryProps {
  icon: ReactNode; // Para usar íconos dinámicos
  name: string;
  count: number;
  active?: boolean; // Si la categoría está seleccionada
}

const CategoryCard = ({ icon, name, count, active = false }: CategoryProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-6 rounded-xl cursor-pointer 
        transition-all duration-300 transform
        ${active ? "bg-orange-400 text-white" : "bg-white hover:bg-orange-100 hover:scale-105"}
      `}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h4 className={`font-bold text-lg ${active ? "text-white" : "text-gray-700"}`}>{name}</h4>
      <p className={`text-sm ${active ? "text-white" : "text-gray-500"}`}>{count} recetas</p>
    </div>
  );
};

export default CategoryCard;
