'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaBriefcase, FaCode, FaPalette, FaChartBar, FaBullhorn } from 'react-icons/fa';

const AboutUsPage = () => {
  // Referencias para las secciones
  const historiaRef = useRef(null);
  const equipoRef = useRef(null);

  // Función para scroll suave con animación
  const scrollToSection = (elementRef) => {
    const yOffset = -80; // Offset para compensar headers fijos si los hay
    const element = elementRef.current;
    if (!element) return;
    
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  };
  // Definimos el tipo de los miembros del equipo
  type TeamMember = {
    name: string;
    pronouns?: string;
    role: string;
    image: string;
    bio: string;
    icon: React.ReactNode;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  
  const team: TeamMember[] = [
    {
      name: 'Andrea Valentina Campaña Intriago',
      role: 'Desarrollador Front-end',
      image: '/images/campana.png',
      bio: 'Especialista en documentaciòn y en crear interfaces de usuario atractivas/responsivas con React y NextJS.',
      icon: <FaCode className="w-5 h-5" />,
      twitter: 'https://x.com/lottieame?t=pDOWmd9b2TFxDhIs8TMsZg&s=09',
      linkedin: 'https://www.linkedin.com/in/andrea-campa%C3%B1a-intriago-969b442b3/',
      github: 'https://github.com/amesitos',
    },
    {
      name: 'René Yasser Herrera Zambrano',
      role: 'Diseñador UX/UI',
      image: '/images/rene.png',
      bio: 'Diseñador creativo enfocado en crear experiencias de usuario intuitivas y estéticas.',
      icon: <FaPalette className="w-5 h-5" />,
      instagram: 'https://www.instagram.com/unbesitoporfa/',
      linkedin: 'https://www.instagram.com/samuel_bun/',
      github: 'https://github.com/renwritescode',
    },
    {
      name: 'Samuel Andrés Vega Mendoza',
      role: 'Especialista en Marketing Digital',
      image: '/images/samuel.png',
      bio: 'Estratega de marketing enfocado en aumentar la visibilidad y posicionamiento de marca.',
      icon: <FaBullhorn className="w-5 h-5" />,
      twitter: 'https://x.com/Samuel_Bun',
      instagram: 'https://www.instagram.com/samuel_bun/',
      github: 'https://github.com/Samuelvega132',
    },
    {
      name: 'Santiago Esquetini Murillo',
      role: 'Desarrollador Back-end',
      image: '/images/dalas.png',
      bio: 'Experto en arquitectura de servidores y desarrollo de APIs robustas y escalables.',
      icon: <FaBriefcase className="w-5 h-5" />,
      instagram: 'https://www.instagram.com/esquetini_/',
      github: 'https://github.com/Sketox',
    },
    {
      name: 'Yhony Saúl Cantos Clavijo',
      role: 'Analista de Datos',
      image: '/images/ioni.png',
      bio: 'Especializado en análisis y visualización de datos para la toma de decisiones estratégicas.',
      icon: <FaChartBar className="w-5 h-5" />,
      github: 'https://github.com/SoftNotName',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Hero */}
      <div className="relative bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        <div className="relative px-4 py-16 sm:py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-md">
              Sobre Nosotros
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-orange-100 max-w-2xl mx-auto mb-6 sm:mb-8">
              Somos un equipo apasionado por crear experiencias culinarias memorables. 
              Nuestra misión es compartir recetas increíbles que inspiren a todos a cocinar.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button 
                onClick={() => scrollToSection(equipoRef)} 
                className="group relative px-6 sm:px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-300 font-medium shadow-md overflow-hidden mb-3 sm:mb-0"
              >
                <span className="relative z-10 transition-transform duration-300 group-active:scale-90">Conoce al Equipo</span>
                <span className="absolute inset-0 bg-orange-100 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
              <button 
                onClick={() => scrollToSection(historiaRef)} 
                className="group relative px-6 sm:px-8 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-all duration-300 font-medium shadow-md overflow-hidden"
              >
                <span className="relative z-10 transition-transform duration-300 group-active:scale-90">Nuestra Historia</span>
                <span className="absolute inset-0 bg-orange-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Wave SVG divisor */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-12 sm:h-16 text-gray-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,134.41,107.46,321.39,56.44Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Stats y números */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 -mt-16 sm:-mt-20 mb-16 relative z-10">
          <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 transition-transform hover:transform hover:scale-105 duration-300">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                250+
              </p>
              <p className="text-gray-600 font-medium text-center">Recetas Deliciosas</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 transition-transform hover:transform hover:scale-105 duration-300">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">5</p>
              <p className="text-gray-600 font-medium text-center">Expertos Culinarios</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 transition-transform hover:transform hover:scale-105 duration-300">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🌎</span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">10K+</p>
              <p className="text-gray-600 font-medium text-center">Usuarios Felices</p>
            </div>
          </div>
        </div>

        {/* Nuestra Historia */}
        <section ref={historiaRef} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-12 sm:mb-16 border border-gray-100 scroll-mt-24 mx-4 sm:mx-0">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10">
            <div className="w-full lg:w-1/2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-3">
                <span className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">📚</span>
                Nuestra Historia
              </h2>
              <p className="text-gray-700 mb-4">
                Cooksy nació de la pasión por la cocina y el deseo de compartir recetas deliciosas con el mundo. 
                Nuestro viaje comenzó en 2023 cuando un grupo de amigos decidió crear una plataforma donde los 
                amantes de la gastronomía pudieran encontrar inspiración culinaria.
              </p>
              <p className="text-gray-700 mb-4">
                Lo que comenzó como un pequeño proyecto universitario se convirtió rápidamente en una comunidad vibrante 
                de chefs aficionados y profesionales compartiendo sus mejores creaciones y secretos culinarios.
              </p>
              <p className="text-gray-700">
                Hoy, estamos comprometidos a seguir creciendo y ofreciendo la mejor experiencia para descubrir, guardar y 
                compartir recetas increíbles que inspiren a más personas a disfrutar del arte de cocinar.
              </p>
            </div>
            <div className="w-full lg:w-1/2 h-60 sm:h-80 relative rounded-xl overflow-hidden shadow-lg">
              <Image 
                src="/images/banner.jpg" 
                alt="Historia de Cooksy" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 sm:p-6">
                <p className="text-white text-base sm:text-xl font-semibold">Un equipo apasionado por la gastronomía</p>
              </div>
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section ref={equipoRef} className="mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestro Equipo</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Conoce a los expertos detrás de Cooksy, cada uno aporta su talento único 
              para crear la mejor experiencia culinaria para nuestros usuarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 px-4 sm:px-0">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl transform hover:translateY-[-5px] px-4 py-8 text-center"
              >
                {/* Imagen circular con foto */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />

                  {/* Círculo con ícono de rol centrado en la parte inferior derecha */}
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 transform translate-x-1 translate-y-1">
                  </div>
                </div>

                <div className="w-full mt-4">
                  <h3 className="font-bold text-xl text-gray-800">{member.name}</h3>
                  {member.pronouns && <p className="text-sm text-gray-500 mb-2"></p>}
                  
                  <div className="inline-block px-4 py-2 rounded-full bg-gray-100 mb-4">
                    <p className="text-gray-700 font-medium text-sm">{member.role}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6">{member.bio}</p>

                  <div className="flex justify-center gap-3 mt-auto">
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:text-blue-500 transition-all"
                        title="Twitter"
                      >
                        <FaTwitter className="w-4 h-4" />
                      </a>
                    )}
                    
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-all"
                        title="Instagram"
                      >
                        <FaInstagram className="w-4 h-4" />
                      </a>
                    )}
                    
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 transition-all"
                        title="LinkedIn"
                      >
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white transition-all"
                        title="GitHub"
                      >
                        <FaGithub className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-12 sm:mb-16 border border-gray-100 mx-4 sm:mx-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-10 text-center">Nuestros Valores</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                emoji: '🤝', 
                title: 'Comunidad', 
                description: 'Creemos en el poder de compartir conocimientos y experiencias culinarias para crecer juntos.', 
                bgFrom: 'from-orange-50', 
                bgColor: 'bg-orange-100',
                border: 'border-orange-100'
              },
              { 
                emoji: '🌱', 
                title: 'Sostenibilidad', 
                description: 'Promovemos prácticas culinarias sostenibles y el uso responsable de ingredientes locales.', 
                bgFrom: 'from-green-50', 
                bgColor: 'bg-green-100',
                border: 'border-green-100'
              },
              { 
                emoji: '💡', 
                title: 'Innovación', 
                description: 'Constantemente buscamos nuevas formas de mejorar la experiencia culinaria de nuestros usuarios.', 
                bgFrom: 'from-blue-50', 
                bgColor: 'bg-blue-100',
                border: 'border-blue-100'
              }
            ].map((valor, index) => (
              <div key={index} className={`flex flex-col items-center text-center p-5 sm:p-6 rounded-xl bg-gradient-to-b ${valor.bgFrom} to-white border ${valor.border}`}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${valor.bgColor} rounded-full flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl`}>
                  {valor.emoji}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">{valor.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {valor.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl overflow-hidden mx-4 sm:mx-0">
          <div className="relative p-6 sm:p-8 md:p-12">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">¿Listo para comenzar tu aventura culinaria?</h2>
              <p className="text-orange-100 mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base">
                Únete a nuestra comunidad de amantes de la gastronomía y descubre miles de recetas increíbles.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <a 
                  href="/recipes" 
                  className="group relative px-6 sm:px-8 py-2 sm:py-3 bg-white text-orange-600 rounded-lg transition-all duration-300 font-medium shadow-md overflow-hidden text-center"
                >
                  <span className="relative z-10 group-hover:text-orange-700 transition-all duration-300 group-active:scale-95 inline-block transform">
                    Explorar Recetas
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
                <a 
                  href="/register" 
                  className="group relative px-6 sm:px-8 py-2 sm:py-3 bg-orange-800 text-white rounded-lg transition-all duration-300 font-medium shadow-md overflow-hidden text-center"
                >
                  <span className="relative z-10 transition-all duration-300 group-active:scale-95 inline-block transform">
                    Registrarse
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-700 to-red-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </a>
              </div>
            </div>
            
            {/* Patrones decorativos */}
            <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M41.3,-70.9C54.4,-64.3,66.6,-55,73.9,-42.3C81.2,-29.6,83.6,-14.8,83.1,-0.3C82.5,14.2,79,28.4,71.6,40.5C64.3,52.7,53.2,62.9,40.3,70.5C27.3,78.1,13.7,83.2,0.1,83C-13.5,82.8,-27,77.4,-39.5,70C-52,62.6,-63.5,53.3,-70.9,41.3C-78.3,29.3,-81.7,14.6,-81.7,0C-81.7,-14.7,-78.4,-29.4,-70.9,-41.6C-63.4,-53.8,-51.8,-63.5,-38.8,-69.8C-25.7,-76.1,-12.9,-79.1,0.7,-80.3C14.3,-81.5,28.6,-80.8,41.3,-74.2Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-40 h-40 opacity-20">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M39.9,-68.3C52.6,-62.5,64.4,-53.1,71.1,-40.7C77.9,-28.3,79.5,-14.1,78.7,-0.5C77.9,13.2,74.7,26.3,67.9,37.8C61,49.2,50.6,59,38.6,65.1C26.6,71.3,13.3,73.9,-0.1,74C-13.4,74.1,-26.8,71.8,-39.4,66.2C-51.9,60.6,-63.5,51.7,-70.4,40C-77.3,28.3,-79.5,14.1,-79.6,0C-79.7,-14.2,-77.6,-28.4,-70.9,-40.4C-64.2,-52.4,-52.9,-62.2,-40.1,-67.8C-27.3,-73.4,-13.6,-74.8,0.2,-75.2C14,-75.5,27.9,-74.8,39.9,-68.3Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUsPage;