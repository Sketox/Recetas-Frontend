interface CategoryProps {
  icon: string;
  name: string;
  count: number;
}

const CategoryCard = ({ icon, name, count }: CategoryProps) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-semibold text-gray-700">{name}</h4>
      <p className="text-sm text-gray-500">{count} recetas</p>
    </div>
  );
};

export default CategoryCard;
