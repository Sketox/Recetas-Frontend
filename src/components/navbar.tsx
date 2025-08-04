"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getIconComponent } from "@/utils/IconSelector";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, userIcon } = useAuth();
  const [searchExpanded, setSearchExpanded] = useState(false);

  const IconComponent = getIconComponent(userIcon || "user-circle");

  return (
    <nav className="flex justify-between items-center shadow-md border-b border-gray-100 p-4 sticky top-0 z-50 bg-white">
      {/* Logo y navegación izquierda */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src="/Cooksy1.svg"
            alt="Cooksy Logo"
            width={100}
            height={100}
            className="h-10 w-auto"
          />
        </Link>
        <Link
          href="/recipes"
          className="ml-6 text-gray-700 hover:text-orange-500 transition-transform duration-300 hover:scale-110"
        >
          Ver Recetas
        </Link>
        <Link
          href="/diet"
          className="ml-4 text-gray-700 hover:text-orange-500 transition-transform duration-300 hover:scale-110"
        >
          Mostrar Dieta
        </Link>
        <Link
          href="/ChatBot"
          className="ml-4 text-gray-700 hover:text-orange-500 transition-transform duration-300 hover:scale-110"
        >
          ChatBot
        </Link>
      </div>

      {/* Contenedor derecho */}
      <div className="flex items-center gap-4">
        {/* Barra de búsqueda responsive */}
        <div
          className={`flex items-center border border-gray-300 rounded-full bg-white transition-all duration-300 overflow-hidden ${
            searchExpanded ? "w-48 sm:w-64 md:w-80" : "w-10"
          }`}
        >
          <button
            onClick={() => setSearchExpanded(!searchExpanded)}
            className="flex items-center justify-center w-10 h-10"
          >
            <FaSearch className="text-gray-500" />
          </button>
          {searchExpanded && (
            <input
              type="text"
              placeholder="Buscar recetas..."
              className="bg-transparent outline-none px-3 py-2 text-gray-700 w-full"
              autoFocus
            />
          )}
        </div>

        {/* Botones de sesión o ícono de perfil */}
        {!isAuthenticated && pathname !== "/register" && (
          <Link href="/register">
            <button className="px-5 py-2 bg-orange-400 text-white rounded hover:bg-orange-600 transition-transform hover:scale-110">
              Regístrate
            </button>
          </Link>
        )}

        {!isAuthenticated && pathname !== "/login" && (
          <Link href="/login">
            <button className="border px-4 py-2 rounded bg-white hover:bg-gray-100 font-bold transition-transform hover:scale-110">
              Iniciar Sesión
            </button>
          </Link>
        )}

        {isAuthenticated && (
          <button onClick={() => router.push("/user")}>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:scale-110 transition-transform">
              <IconComponent className="w-6 h-6 text-orange-500" />
            </div>
          </button>
        )}
      </div>
    </nav>
  );
}
