import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Mapa del sitio */}
        <div>
          <h3 className="font-semibold mb-4">Mapa del sitio</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/recipes" className="hover:text-orange-500 transition-colors">Todas las recetas</Link></li>
            <li><Link href="/share" className="hover:text-orange-500 transition-colors">Comparte tus ingredientes</Link></li>
          </ul>
        </div>

        {/* Categoría de Recetas */}
        <div>
          <h3 className="font-semibold mb-4">Categoría de Recetas</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/recipes?cat=desayunos" className="hover:text-orange-500 transition-colors">Desayunos</Link></li>
            <li><Link href="/recipes?cat=platos-fuertes" className="hover:text-orange-500 transition-colors">Platos fuertes</Link></li>
            <li><Link href="/recipes?cat=postres" className="hover:text-orange-500 transition-colors">Postres</Link></li>
            <li><Link href="/recipes?cat=especiales" className="hover:text-orange-500 transition-colors">Especiales</Link></li>
          </ul>
        </div>

        {/* Extras */}
        <div>
          <h3 className="font-semibold mb-4">Extras</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about_us" className="hover:text-orange-500 transition-colors">Sobre nosotros :D</Link></li>
          </ul>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center md:justify-end">
          <Image
            src="/cooksy.svg"
            alt="Cooksy Logo"
            width={100}
            height={100}
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* Línea inferior */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-100">
        © {new Date().getFullYear()} Cooksy. Todos los derechos reservados.
      </div>
    </footer>
  );
}
