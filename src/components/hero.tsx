import Image from "next/image";
import { FaUtensils, FaUsers } from "react-icons/fa";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative max-w-7xl mx-auto h-[250px] md:h-[300px] lg:h-[350px] text-center rounded-3xl overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner.jpg"
          alt="Banner de cocina"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay para opacidad */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-4xl md:text-4xl font-extrabold mb-4">
          <span className="text-white">Descubre el placer de cocinar</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base mb-4">
          Explora nuestra colección de recetas deliciosas y fáciles de preparar.
          <br /> Desde platos tradicionales hasta creaciones innovadoras.
        </p>

        {/* Botones */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="flex items-center gap-3 px-6 py-3 bg-orange-400 text-white shadow-lg font-semibold rounded hover:bg-orange-600 transition-transform duration-300 hover:scale-110 cursor-pointer">
            <FaUtensils />
            Explora recetas
          </button>
          <Link href="/about_us">
          <button className="flex items-center gap-3 px-6 py-3 bg-orange-400 text-white shadow-lg font-semibold rounded hover:bg-orange-600 transition-transform duration-300 hover:scale-110 cursor-pointer">
            <FaUsers />
            Sobre nosotros
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
