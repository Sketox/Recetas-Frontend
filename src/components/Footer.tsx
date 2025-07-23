import Link from "next/link";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-6">
        {/* Mapa del sitio */}
        <div>
          <h3 className="font-semibold mb-4">Mapa del sitio</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/recipes" className="hover:text-orange-500">Todas las recetas</a></li>
            <li><a href="/share" className="hover:text-orange-500">Comparte tus ingredientes</a></li>
          </ul>
        </div>

        {/* Categoría de Recetas */}
        <div>
          <h3 className="font-semibold mb-4">Categoría de Recetas</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/recipes?cat=desayunos" className="hover:text-orange-500">Desayunos</a></li>
            <li><a href="/recipes?cat=platos-fuertes" className="hover:text-orange-500">Platos fuertes</a></li>
            <li><a href="/recipes?cat=postres" className="hover:text-orange-500">Postres</a></li>
            <li><a href="/recipes?cat=especiales" className="hover:text-orange-500">Especiales</a></li>
          </ul>
        </div>

        {/* Extras */}
        <div>
          <h3 className="font-semibold mb-4">Extras</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about_us" className="hover:text-orange-500">Sobre nosotros :D</a></li>
          </ul>
        </div>
        {/* Logo */}
          <div className="flex items-center gap-6">
          <div className="h-45 w-px bg-gray-200"></div> {/* Línea vertical */}
          <Image
            src="/cooksy.svg"
            alt="Cooksy Logo"
            width={100}
            height={100}
            className="mr-3"
          />
        </div>
      </div>
    </footer>
  );
}
