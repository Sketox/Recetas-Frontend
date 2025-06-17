'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-orange-500">🍳ooksy</span>
        <Link href="/recipes" className="text-gray-700 hover:text-orange-500">Ver Recetas</Link>
      </div>
      <div className="flex items-center gap-4">
        <input type="text" placeholder="Buscar recetas..." className="border rounded px-2 py-1" />
        <button className="border px-4 py-1 rounded bg-white hover:bg-gray-100">Iniciar Sesión</button>
      </div>
    </nav>
  );
}
