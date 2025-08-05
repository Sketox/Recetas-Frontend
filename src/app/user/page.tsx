"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { getIconComponent } from "@/utils/IconSelector";
import IconPicker from "@/components/IconPicker";
import { fetchFromBackend } from "@/services/index";


interface UserProfile {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { userIcon, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [createdRecipes, setCreatedRecipes] = useState([]);

  const [favoriteRecipes] = useState([
    {
      id: 1,
      name: "Paella Valenciana",
      description: "El plato más tradicional de la gastronomía española.",
      imageUrl: "",
    },
  ]);

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

  const IconComponent = getIconComponent(userIcon || "user-circle");

  useEffect(() => {
    const fetchCreatedRecipes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

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
      }
    };

    fetchCreatedRecipes();
  }, []);

  

useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("🔐 Token:", token);

      if (!token) return;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full h-32 rounded-t-lg flex items-center justify-center">
                {recipe.imageUrl && recipe.imageUrl.trim() !== "" ? (
                  <Image src={recipe.imageUrl} alt={recipe.name} width={200} height={128} className="object-cover w-full h-full rounded-t-lg" />
                ) : (
                  <div className={`w-full h-full rounded-t-lg flex flex-col items-center justify-center text-white ${getBackgroundColor(recipe.name)}`}>
                    <div className="text-3xl mb-1">🍽️</div>
                    <span className="text-xs font-medium px-2 text-center opacity-90">
                      {recipe.name.length > 15 ? recipe.name.substring(0, 15) + '...' : recipe.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg">{recipe.name}</h3>
                <p className="text-gray-500 text-sm">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recetas Creadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {createdRecipes.length > 0 ? (
            createdRecipes.map((recipe) => (
              <div key={recipe.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                  <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors">
                    <FaEdit className="text-gray-600 w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg">{recipe.title}</h3>
                  <p className="text-gray-500 text-sm">{recipe.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No has creado ninguna receta aún.</p>
          )}
        </div>
      </section>
    </main>
  );
}
