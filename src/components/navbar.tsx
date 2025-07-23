"use client";

import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname(); // ✅ Ruta actual

  return (
    <nav className="flex justify-between items-center shadow-4xl border-b border-gray-100 p-4 sticky top-0 z-50 shadow-md bg-white">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src="/cooksy.svg"
            alt="Cooksy Logo"
            width={100}
            height={100}
            className="mr-2"
          />
        </Link>
        <Link
          href="/recipes"
          className="ml-6 text-gray-700 hover:text-orange-500 transition-transform duration-300 hover:scale-110"
        >
          Ver Recetas
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Barra de búsqueda */}
        <div className="flex items-center rounded-full px-4 border border-gray-300 w-100 bg-white">
          <FaSearch className="text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="Buscar recetas..."
            className="bg-transparent outline-none px-3 py-2 text-gray-700 w-full"
          />
        </div>

        {/* Ocultar "Regístrate" si estamos en /register */}
        {pathname !== "/register" && (
          <Link href="/register">
            <button className="flex items-center gap-2 px-5 py-2 bg-orange-400 text-white rounded hover:bg-orange-600 transition-transform duration-300 hover:scale-110 cursor-pointer">
              Regístrate
            </button>
          </Link>
        )}

        {/* Ocultar "Iniciar Sesión" si estamos en /login */}
        {pathname !== "/login" && (
          <Link href="/login">
            <button className="border px-4 py-2 rounded bg-white hover:bg-gray-100 font-bold transition-transform duration-300 hover:scale-110 cursor-pointer">
              Iniciar Sesión
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
