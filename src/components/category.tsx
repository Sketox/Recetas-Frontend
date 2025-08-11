import React from "react";

interface CategoryProps {
  icon: string;
  name: string;
  count: number;
  onClick?: () => void;
  isActive?: boolean;
}

const CategoryCard = ({ icon, name, count, onClick, isActive }: CategoryProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition 
        ${
          isActive
            ? "bg-orange-300 text-white"
            : "bg-white text-gray-700 hover:bg-orange-100"
        }
      `}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <h3 className="text-base font-semibold">{name}</h3>
      <p className={`text-sm ${isActive ? "text-white" : "text-gray-500"}`}>
        {count} recetas
      </p>
    </div>
  );
};

export default CategoryCard;
