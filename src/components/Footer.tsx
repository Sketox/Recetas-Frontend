import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-500 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-400 rounded-full blur-lg"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Mapa del sitio */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-400 mb-4 relative">
              Mapa del sitio
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400"></div>
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link 
                  href="/recipes" 
                  className="hover:text-orange-400 transition-all duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Todas las recetas
                </Link>
              </li>
              <li>
                <Link 
                  href="/share" 
                  className="hover:text-orange-400 transition-all duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Comparte tus ingredientes
                </Link>
              </li>
            </ul>
          </div>

          {/* Categoría de Recetas */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-400 mb-4 relative">
              Categorías
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400"></div>
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link 
                  href="/recipes?cat=desayunos" 
                  className="hover:text-orange-400 transition-all duration-200 flex items-center group"
                >
                  <span className="text-lg mr-2">🥐</span>
                  Desayunos
                </Link>
              </li>
              <li>
                <Link 
                  href="/recipes?cat=platos-fuertes" 
                  className="hover:text-orange-400 transition-all duration-200 flex items-center group"
                >
                  <span className="text-lg mr-2">🍽️</span>
                  Platos fuertes
                </Link>
              </li>
              <li>
                <Link 
                  href="/recipes?cat=postres" 
                  className="hover:text-orange-400 transition-all duration-200 flex items-center group"
                >
                  <span className="text-lg mr-2">🍰</span>
                  Postres
                </Link>
              </li>
              <li>
                <Link 
                  href="/recipes?cat=especiales" 
                  className="hover:text-orange-400 transition-all duration-200 flex items-center group"
                >
                  <span className="text-lg mr-2">⭐</span>
                  Especiales
                </Link>
              </li>
            </ul>
          </div>

          {/* Extras */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-400 mb-4 relative">
              Extras
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400"></div>
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link 
                  href="/about_us" 
                  className="hover:text-orange-400 transition-all duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo y redes sociales */}
          <div className="flex flex-col items-center md:items-end space-y-6">
            <div className="transform hover:scale-105 transition-all duration-200">
              <Image
                src="/cooksy.svg"
                alt="Cooksy Logo"
                width={120}
                height={120}
                className="h-16 w-auto drop-shadow-lg"
              />
            </div>
            
            {/* Redes sociales simuladas */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition-all duration-200 cursor-pointer transform hover:scale-110">
                <span className="text-white font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition-all duration-200 cursor-pointer transform hover:scale-110">
                <span className="text-white font-bold">@</span>
              </div>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition-all duration-200 cursor-pointer transform hover:scale-110">
                <span className="text-white font-bold">in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separador elegante */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 w-12 h-1 rounded-full"></div>
          </div>
        </div>

        {/* Línea inferior modernizada */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} <span className="text-orange-400 font-semibold">Cooksy</span>. 
            Todos los derechos reservados. Hecho con ❤️ para los amantes de la cocina.
          </p>
        </div>
      </div>
    </footer>
  );
}
