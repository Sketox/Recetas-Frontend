"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { getIconComponent } from "@/utils/IconSelector";
import IconPicker from "@/components/IconPicker";

interface UserProfile {
  name: string;
  email: string;
  location?: string;
  avatar?: string | null;
  pronouns?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { userIcon, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [favoriteRecipes] = useState([
    {
      id: 1,
      name: "Paella Valenciana",
      description: "El plato más tradicional de la gastronomía española.",
      imageUrl: "",
    },
  ]);

  const [createdRecipes] = useState([
    {
      id: 2,
      name: "Nombre del Plato",
      description: "Descripción del plato",
      imageUrl: null,
    },
  ]);

  const IconComponent = getIconComponent(userIcon || "user-circle");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener el perfil");

        const data = await res.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 pb-16">
      <section className="relative bg-[#FF8C42] h-48 sm:h-60 flex items-end justify-center">
        <div className="absolute -bottom-16 sm:-bottom-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
          {userProfile?.avatar ? (
            <Image
              src={userProfile.avatar}
              alt="Avatar del usuario"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          ) : (
            <IconComponent className="w-20 h-20 text-gray-600" />
          )}
        </div>
      </section>

      <section className="pt-20 sm:pt-24 pb-8 text-center bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {userProfile?.name || "Cargando..."}
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {userProfile?.pronouns || ""}
        </p>
        <p className="text-gray-700 text-md mt-2">
          {userProfile?.location || ""}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recetas Favoritas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                {recipe.imageUrl ? (
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    width={200}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No hay imagen</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {recipe.name}
                </h3>
                <p className="text-gray-500 text-sm">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recetas Creadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {createdRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center relative">
                {recipe.imageUrl ? (
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    width={200}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No hay imagen</span>
                )}
                <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors">
                  <FaEdit className="text-gray-600 w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {recipe.name}
                </h3>
                <p className="text-gray-500 text-sm">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
