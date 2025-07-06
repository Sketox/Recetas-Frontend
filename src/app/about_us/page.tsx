//Aún falta el backend
'use client';

import React from 'react';
import Navbar from '../../components/navbar';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

const AboutUsPage = () => {
  const team = Array(6).fill({
    name: 'Whitney Francis',
    pronouns: '(He/Him)',
    role: 'Copywriter',
  });

  return (
    <>
      <Navbar />

      <main className="bg-white text-center">
        {/* Hero */}
        <section className="bg-[#FF8C42] text-white py-12 px-4">
          <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="max-w-2xl mx-auto text-base font-medium">
            We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.
          </p>
        </section>

        {/* Team Grid */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Avatar */}
                <div className="w-32 h-32 bg-[#3A2F2F] rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-4xl">👤</span>
                </div>
                {/* Nombre */}
                <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.pronouns}</p>
                <p className="text-sm text-gray-700 mt-1">{member.role}</p>
                {/* Redes sociales */}
                <div className="flex gap-4 mt-3 text-gray-400">
                  <FaTwitter className="w-5 h-5" />
                  <FaLinkedin className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
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
                <img src="/logo-cooksy.svg" alt="Cooksy Logo" className="w-20 mb-2" />
                <span className="text-sm font-semibold text-gray-800">cooksy</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default AboutUsPage;