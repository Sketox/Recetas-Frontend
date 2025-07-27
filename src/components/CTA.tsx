'use client';

import { useState } from 'react';
import CreateRecipeModal from './page';

const CTA = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="bg-gray-100 py-10 px-4 text-center rounded-lg">
        <h2 className="text-xl font-semibold mb-2">¿Tienes una receta para compartir?</h2>
        <p className="text-gray-500 mb-4">
          Comparte tus creaciones culinarias con nuestra comunidad.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          + Crear Nueva Receta
        </button>
      </section>

      {showModal && <CreateRecipeModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default CTA;
