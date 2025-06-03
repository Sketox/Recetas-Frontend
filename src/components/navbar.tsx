"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-blue-600">
            🍴 Recetas App
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="text-gray-600 hover:text-blue-600">Inicio</span>
          </Link>
          <Link href="/recetas">
            <span className="text-gray-600 hover:text-blue-600">
              Todas las Recetas
            </span>
          </Link>
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
