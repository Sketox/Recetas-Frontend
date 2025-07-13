'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import Image from 'next/image';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Ignatius Keller',
    pronouns: '(He/Him)',
    location: 'Sausalito, California, United States',
    avatar: null,
  });

  const [favoriteRecipes, setFavoriteRecipes] = useState([
    {
      id: 1,
      name: 'Paella Valenciana',
      description: 'El plato más tradicional de la gastronomía española, originario de Valencia.',
      imageUrl: '',
    },
    { id: 2, name: 'Nombre del Plato', description: 'Descripción del plato', imageUrl: null },
    { id: 3, name: 'Nombre del Plato', description: 'Descripción del plato', imageUrl: null },
    { id: 4, name: 'Nombre del Plato', description: 'Descripción del plato', imageUrl: null },
  ]);

  const [createdRecipes, setCreatedRecipes] = useState([
    { id: 5, name: 'Nombre del Plato', description: 'Descripción del plato', imageUrl: null },
    { id: 6, name: 'Nombre del Plato', description: 'Descripción del plato', imageUrl: null },
    { id: 7, name: 'Nombre del Plato', description: 'Descripción del plato', imageUrl: null },
    { id: 8, name: 'Nombre del Plato', description: 'Descripción del plato', imageUrl: null },
  ]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 pb-16">
        <section className="relative bg-[#FF8C42] h-48 sm:h-60 flex items-end justify-center">
          <div className="absolute -bottom-16 sm:-bottom-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
            {userProfile.avatar ? (
              <Image
                src={userProfile.avatar}
                alt="Avatar del usuario"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            ) : (
              <FaUserCircle className="text-gray-600 text-7xl sm:text-8xl" />
            )}
          </div>
        </section>

        <section className="pt-20 sm:pt-24 pb-8 text-center bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 px-4">
          <h1 className="text-3xl font-bold text-gray-900">{userProfile.name}</h1>
          <p className="text-gray-600 text-sm mt-1">{userProfile.pronouns}</p>
          <p className="text-gray-700 text-md mt-2">{userProfile.location}</p>
          <button className="mt-6 bg-[#FF8C42] text-white py-2 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-md">
            Editar perfil
          </button>
        </section>

        <section className="bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recetas Favoritas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteRecipes.map((recipe) => (
              <div key={recipe.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{recipe.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{recipe.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-[#FF8C42] hover:text-orange-600 font-semibold transition-colors">
              Ver todos los favoritos
            </button>
          </div>
        </section>

        <section className="bg-white shadow-md mx-auto max-w-4xl rounded-lg mt-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recetas Creadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {createdRecipes.map((recipe) => (
              <div key={recipe.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                  <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{recipe.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{recipe.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-[#FF8C42] hover:text-orange-600 font-semibold transition-colors">
              Ver todas tus recetas
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t pt-10 pb-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Mapa del sitio</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Todas las recetas</li>
              <li>Comparte tus ingredientes</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Categoría de Recetas</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Desayunos</li>
              <li>Platos fuertes</li>
              <li>Postres</li>
            </ul>
          </div>
          <div className="flex items-center justify-start md:justify-end">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800">🍳ooksy</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}