const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export async function fetchFromBackend<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    console.log("🌐 Haciendo petición a:", url);
    console.log("📤 Opciones de la petición:", options);
    
    // 🔧 Preparar headers de manera más explícita
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // Agregar headers adicionales (como Authorization)
    if (options.headers) {
      const optionsHeaders = new Headers(options.headers);
      optionsHeaders.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-type') {
          headers.set(key, value);
        }
      });
    }

    const response = await fetch(url, {
      ...options,
      headers: headers,
    });

    console.log("📥 Respuesta recibida:", response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error("❌ Error en la respuesta:", errorData);
      throw new Error(errorData.message || errorData.error || 'Error en la solicitud');
    }

    const result = await response.json();
    console.log("✅ Datos recibidos:", result);
    return result;
  } catch (error) {
    console.error('💥 Error al conectar con el backend:', error);
    throw error;
  }
}
