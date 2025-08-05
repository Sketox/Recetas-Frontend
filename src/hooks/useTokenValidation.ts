import { useEffect } from 'react';

export const useTokenValidation = () => {
  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Decodificar el token para verificar si está expirado
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {
          // Token expirado, limpiarlo
          console.log('🗑️ Token expirado, limpiando localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('userIcon');
          
          // Opcional: redirigir al login si estamos en una página protegida
          if (window.location.pathname.includes('/user')) {
            window.location.href = '/login';
          }
        }
      } catch (error) {
        // Token malformado, limpiarlo
        console.log('🗑️ Token malformado, limpiando localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('userIcon');
      }
    };

    // Validar al cargar y cada 5 minutos
    validateToken();
    const interval = setInterval(validateToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useTokenValidation;
