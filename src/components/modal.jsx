import Image from 'next/image';
import Link from 'next/link';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full relative overflow-hidden border border-gray-300">
        {/* Encabezado del modal */}
        <div className="bg-[#FF8C42] flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/cooksy.svg"
              alt="Cooksy Logo"
              width={100}
              height={100}
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="text-white text-4xl font-extrabold hover:text-gray-200 transition-transform transform hover:scale-110"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
