"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getIconComponent } from "@/utils/IconSelector";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { fetchFromBackend } from "@/services";

interface SearchSuggestion {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  matchedIngredients: string[];
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, userIcon } = useAuth();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const IconComponent = getIconComponent(userIcon || "user-circle");

  // Buscar sugerencias cuando cambia el query
  useEffect(() => {
    const searchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      console.log("🔍 Buscando sugerencias para:", searchQuery);
      setShowSuggestions(true); // Mostrar dropdown incluso si no hay sugerencias

      try {
        const data = await fetchFromBackend(`/recipes/search-suggestions?q=${encodeURIComponent(searchQuery)}`) as SearchSuggestion[];
        console.log("🔍 Sugerencias recibidas:", data);
        setSuggestions(data || []);
      } catch (error) {
        console.error("Error al buscar sugerencias:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(searchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = async (suggestion: SearchSuggestion) => {
    console.log("🔗 Navegando a receta:", suggestion);
    try {
      // Obtener la receta completa del backend
      const fullRecipe = await fetchFromBackend(`/recipes/${suggestion.id}`);
      localStorage.setItem("selectedRecipe", JSON.stringify(fullRecipe));
      router.push("/recipe_detail");
    } catch (error) {
      console.error("Error al obtener receta completa:", error);
      // Fallback: usar los datos limitados de la sugerencia
      localStorage.setItem("selectedRecipe", JSON.stringify(suggestion));
      router.push("/recipe_detail");
    }
    setSearchQuery("");
    setShowSuggestions(false);
    setSearchExpanded(false);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log("🔍 Búsqueda con Enter:", searchQuery);
      // Redirigir a la página de recetas con el término de búsqueda
      router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setSearchExpanded(false);
    }
  };

  return (
    <nav className="flex justify-between items-center shadow-lg border-b border-gray-200 p-3 sm:p-4 sticky top-0 z-50 bg-gradient-to-r from-white via-orange-50 to-white backdrop-blur-md">
      {/* Logo y navegación izquierda */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Link href="/" className="transform hover:scale-105 transition-all duration-200">
          <Image
            src="/Cooksy1.svg"
            alt="Cooksy Logo"
            width={100}
            height={100}
            className="h-8 sm:h-10 w-auto drop-shadow-sm"
          />
        </Link>
        
        {/* Enlaces de navegación - ocultos en móvil */}
        <div className="hidden md:flex items-center ml-4 lg:ml-6 gap-2">
          <Link
            href="/recipes"
            className="relative px-3 lg:px-4 py-2 text-gray-700 hover:text-orange-500 transition-all duration-300 rounded-lg hover:bg-orange-50 font-medium text-sm lg:text-base group"
          >
            Ver Recetas
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </Link>
          <Link
            href="/diet"
            className="relative px-3 lg:px-4 py-2 text-gray-700 hover:text-orange-500 transition-all duration-300 rounded-lg hover:bg-orange-50 font-medium text-sm lg:text-base group"
          >
            Mostrar Dieta
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </Link>
          <Link
            href="/ChatBot"
            className="relative px-3 lg:px-4 py-2 text-gray-700 hover:text-orange-500 transition-all duration-300 rounded-lg hover:bg-orange-50 font-medium text-sm lg:text-base group"
          >
            ChatBot
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Contenedor derecho */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Barra de búsqueda responsive con sugerencias */}
        <div className="relative" ref={searchRef}>
          <div
            className={`flex items-center border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl ${
              searchExpanded ? "w-40 sm:w-48 md:w-64 lg:w-80 border-orange-300" : "w-9 sm:w-10 hover:border-orange-200"
            }`}
          >
            <button
              onClick={() => setSearchExpanded(!searchExpanded)}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 hover:bg-orange-50 rounded-l-xl transition-colors duration-200"
            >
              <FaSearch className="text-gray-500 hover:text-orange-500 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200" />
            </button>
            {searchExpanded && (
              <input
                type="text"
                placeholder="Buscar recetas deliciosas..."
                className="bg-transparent outline-none px-2 sm:px-3 py-2 text-gray-700 w-full text-sm sm:text-base placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay para permitir clicks en sugerencias
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                autoFocus
              />
            )}
          </div>

          {/* Dropdown de sugerencias */}
          {showSuggestions && searchExpanded && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-72 sm:max-h-96 overflow-y-auto backdrop-blur-sm">
              {suggestions.length > 0 ? (
                <>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`flex items-center p-3 sm:p-4 hover:bg-orange-50 cursor-pointer transition-all duration-200 ${
                        index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      {suggestion.imageUrl && (
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 mr-3 sm:mr-4 flex-shrink-0">
                          <Image 
                            src={suggestion.imageUrl} 
                            alt={suggestion.title}
                            fill
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate mb-1">{suggestion.title}</h4>
                        <p className="text-xs sm:text-sm text-orange-600 font-medium mb-1">{suggestion.category}</p>
                        {suggestion.matchedIngredients.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {suggestion.matchedIngredients.slice(0, 2).map((ingredient, index) => (
                              <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium truncate max-w-20">
                                {ingredient}
                              </span>
                            ))}
                            {suggestion.matchedIngredients.length > 2 && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">+{suggestion.matchedIngredients.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {searchQuery.trim().length >= 2 && (
                    <div
                      onClick={() => {
                        router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchQuery("");
                        setShowSuggestions(false);
                        setSearchExpanded(false);
                      }}
                      className="flex items-center p-3 sm:p-4 hover:bg-blue-50 cursor-pointer border-t-2 border-gray-100 text-blue-600 transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FaSearch className="text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold truncate">Ver todos los resultados para &quot;{searchQuery}&quot;</span>
                    </div>
                  )}
                </>
              ) : searchQuery.trim().length >= 2 ? (
                <div
                  onClick={() => {
                    router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery("");
                    setShowSuggestions(false);
                    setSearchExpanded(false);
                  }}
                  className="flex items-center p-3 sm:p-4 hover:bg-blue-50 cursor-pointer text-blue-600 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FaSearch className="text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold truncate">Buscar &quot;{searchQuery}&quot;</span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Botones de sesión o ícono de perfil */}
        {!isAuthenticated && pathname !== "/register" && (
          <Link href="/register">
            <button className="px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base font-semibold">
              <span className="hidden sm:inline">Regístrate</span>
              <span className="sm:hidden">+</span>
            </button>
          </Link>
        )}

        {!isAuthenticated && pathname !== "/login" && (
          <Link href="/login">
            <button className="border-2 border-gray-300 px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-white hover:bg-gray-50 hover:border-orange-300 font-semibold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base shadow-md hover:shadow-lg">
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Login</span>
            </button>
          </Link>
        )}

        {isAuthenticated && (
          <button 
            onClick={() => router.push("/user")}
            className="group relative"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center hover:from-orange-200 hover:to-orange-300 transition-all duration-200 transform group-hover:scale-110 shadow-lg group-hover:shadow-xl border-2 border-white">
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </button>
        )}
      </div>
    </nav>
  );
}
