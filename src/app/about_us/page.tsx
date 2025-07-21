'use client';

import React from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/Footer';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

const AboutUsPage = () => {
  const team = [
    {
      name: 'Andrea Valentina Campaña Intriago',
      pronouns: '(Ella/Her)',
      role: 'Desarrollador Front-end',
    },
    {
      name: 'René Yasser Herrera Zambrano',
      pronouns: '(Él/Him)',
      role: 'Diseñador UX/UI',
    },
    {
      name: 'Samuel Andrés Vega Mendoza',
      pronouns: '(Él/Him)',
      role: 'Especialista en Marketing Digital',
    },
    {
      name: 'Santiago Esquetini Murillo',
      pronouns: '(Él/Him)',
      role: 'Desarrollador Back-end',
    },
    {
      name: 'Yhony Saúl Cantos Clavijo',
      pronouns: '(Él/Him)',
      role: 'Analista de Datos',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-white text-center">
        <section className="bg-[#FF8C42] text-white py-12 px-4">
          <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="max-w-2xl mx-auto text-base font-medium">
            We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.
          </p>
        </section>

        <section className="py-16 bg-gray-50 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-32 h-32 bg-[#3A2F2F] rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-4xl">👤</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.pronouns}</p>
                <p className="text-sm text-gray-700 mt-1">{member.role}</p>
                <div className="flex gap-4 mt-3 text-gray-400">
                  <FaTwitter className="w-5 h-5" />
                  <FaLinkedin className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default AboutUsPage;