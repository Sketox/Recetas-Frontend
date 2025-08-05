import Image from 'next/image';
import Link from 'next/link';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-gradient-to-br from-black/40 via-purple-900/20 to-orange-900/30 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full mx-4 relative overflow-hidden border border-white/20 transform animate-slideUp">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        
        {/* Encabezado del modal */}
        <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 flex items-center justify-between px-6 py-4 shadow-lg">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
              <Image
                src="/cooksy.svg"
                alt="Cooksy Logo"
                width={100}
                height={100}
                className="h-8 w-auto filter brightness-0 invert"
              />
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">Cooksy</span>
          </Link>
          
          {/* Close button with modern design */}
          <button
            onClick={onClose}
            className="group relative p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            aria-label="Cerrar modal"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg 
              className="w-6 h-6 text-white relative z-10" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="relative p-6 overflow-y-auto max-h-[80vh] bg-gradient-to-br from-gray-50/50 to-white/80 backdrop-blur-sm">
          {children}
        </div>
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500"></div>
      </div>
    </div>
  );
}
