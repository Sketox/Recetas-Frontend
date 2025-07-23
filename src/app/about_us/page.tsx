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
      image: '/images/campana.png',
      twitter: 'https://x.com/lottieame?t=pDOWmd9b2TFxDhIs8TMsZg&s=09',
      linkedin: 'https://www.linkedin.com/in/andrea-campa%C3%B1a-intriago-969b442b3/',
    },
    {
      name: 'René Yasser Herrera Zambrano',
      pronouns: '(Él/Him)',
      role: 'Diseñador UX/UI',
      image: '/images/rene.png',
      twitter: 'https://www.instagram.com/samuel_bun/',
      linkedin: 'https://www.instagram.com/samuel_bun/',
    },
    {
      name: 'Samuel Andrés Vega Mendoza',
      pronouns: '(Él/Him)',
      role: 'Especialista en Marketing Digital',
      image: '/images/samuel.png',
      twitter: 'https://www.instagram.com/samuel_bun/',
      linkedin: 'https://www.instagram.com/samuel_bun/',
    },
    {
      name: 'Santiago Esquetini Murillo',
      pronouns: '(Él/Him)',
      role: 'Desarrollador Back-end',
      image: '/images/dalas.png',
      twitter: 'https://www.instagram.com/samuel_bun/',
      linkedin: 'https://www.instagram.com/samuel_bun/',
    },
    {
      name: 'Yhony Saúl Cantos Clavijo',
      pronouns: '(Él/Him)',
      role: 'Analista de Datos',
      image: '/images/ioni.png',
      twitter: 'https://www.instagram.com/samuel_bun/',
      linkedin: 'https://www.instagram.com/samuel_bun/',
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto"
          >
            {team.map((member, index) => (
              
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-40 h-40 mb-5 overflow-hidden rounded-full border border-gray-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                />
              </div>
                <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.pronouns}</p>
                <p className="text-sm text-gray-700 mt-1">{member.role}</p>

                <div className="flex gap-4 mt-3 text-gray-500">
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:text-blue-400 hover:brightness-110 hover:scale-140"
                  title="Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:text-blue-600 hover:brightness-110 hover:scale-140"
                  title="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
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