import Link from "next/link";

const CTA = () => {
  return (
    <section className="bg-gray-100 py-10 px-4 text-center rounded-lg">
      <h2 className="text-xl font-semibold mb-2">
        ¿Tienes una receta para compartir?
      </h2>
      <p className="text-gray-500 mb-4">
        Comparte tus creaciones culinarias con nuestra comunidad. Sube tus
        recetas favoritas y ayuda a otros a descubrir nuevos sabores.
      </p>
      <Link href="/create_recipe">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          + Crear Nueva Receta
        </button>
      </Link>
    </section>
  );
};

export default CTA;
