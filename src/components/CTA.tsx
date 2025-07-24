import { FaPlus } from "react-icons/fa";

interface CTAProps {
  onOpenModal: () => void; // ✅ Prop para abrir el modal
}

const CTA: React.FC<CTAProps> = ({ onOpenModal }) => {
  return (
    <section className="w-full bg-[#f6eee9] py-11 px-5 text-center">
      <h2 className="text-2xl font-extrabold text-[#3a2f2f] mb-2">
        ¿Tienes una receta para compartir?
      </h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Comparte tus creaciones culinarias con nuestra comunidad. Sube tus
        recetas favoritas y ayuda a otros a descubrir nuevos sabores.
      </p>

      {/* ✅ Botón que abre el modal */}
      <button
        onClick={onOpenModal}
        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg text-lg mx-auto transition-all duration-300 transform hover:scale-110 cursor-pointer"
      >
        <FaPlus className="text-white" /> Crear
      </button>
    </section>
  );
};

export default CTA;
