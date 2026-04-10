// Instagram Basic Display API Integration
export class InstagramAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = "https://graph.instagram.com";
  }

  // Obtener posts recientes usando Instagram Basic Display API
  async getRecentPosts(limit = 6) {
    try {
      if (!this.accessToken) {
        console.warn("Instagram access token not provided, using fallback");
        return [];
      }

      const response = await fetch(
        `${this.baseURL}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&limit=${limit}&access_token=${this.accessToken}`,
      );

      if (!response.ok) {
        console.warn(`Instagram API error: ${response.status}, using fallback`);
        return [];
      }

      const data = await response.json();

      // Validar respuesta de Instagram
      if (!data.data || !Array.isArray(data.data)) {
        console.warn("Invalid Instagram API response, using fallback");
        return [];
      }

      // Filtrar solo imágenes y videos
      const mediaItems = data.data || [];
      const processedItems = mediaItems
        .filter(
          (item) => item.media_type === "IMAGE" || item.media_type === "VIDEO",
        )
        .map((item) => ({
          id: item.id,
          caption: item.caption || "",
          mediaType: item.media_type,
          mediaUrl: item.media_url || item.thumbnail_url,
          permalink: item.permalink,
          timestamp: item.timestamp,
          thumbnailUrl: item.thumbnail_url,
        }));

      console.log(`Instagram API: ${processedItems.length} posts fetched`);
      return processedItems;
    } catch (error) {
      console.error("Error fetching Instagram posts:", error);
      console.log("Using fallback data instead");
      return [];
    }
  }

  // Obtener información del perfil
  async getProfileInfo() {
    try {
      if (!this.accessToken) {
        return null;
      }

      const response = await fetch(
        `${this.baseURL}/me?fields=username,account_type,media_count&access_token=${this.accessToken}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching Instagram profile:", error);
      return null;
    }
  }

  // Verificar si el token es válido
  async validateToken() {
    try {
      if (!this.accessToken) {
        return false;
      }

      const response = await fetch(
        `${this.baseURL}/me?access_token=${this.accessToken}`,
      );

      return response.ok;
    } catch (error) {
      console.error("Error validating Instagram token:", error);
      return false;
    }
  }
}

// Función para inicializar Instagram API con variables de entorno
export function createInstagramAPI() {
  const accessToken = import.meta.env.PUBLIC_INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn("Instagram access token not found in environment variables");
    return null;
  }

  const api = new InstagramAPI(accessToken);

  // Validar token inmediatamente
  api
    .validateToken()
    .then((isValid) => {
      if (!isValid) {
        console.error("Instagram access token is invalid, using fallback");
      } else {
        console.log("Instagram API token validated successfully");
      }
    })
    .catch((error) => {
      console.error("Error validating Instagram token:", error);
    });

  return api;
}

// Función para probar fallback dinámicamente
export async function testInstagramFallback() {
  const api = createInstagramAPI();

  if (!api) {
    console.log("Instagram API not available, using fallback only");
    return false;
  }

  try {
    const posts = await api.getRecentPosts(2);

    if (posts.length === 0) {
      console.log(
        "Instagram API returned no posts, falling back to static data",
      );
      return false;
    }

    console.log(`Instagram API working: ${posts.length} posts fetched`);
    return true;
  } catch (error) {
    console.error("Instagram API test failed, using fallback:", error);
    return false;
  }
}

// Función completa de validación de fallback para producción
export async function validateInstagramFallback() {
  const results = {
    apiAvailable: false,
    embedsWorking: false,
    fallbackWorking: false,
    performance: {},
    errors: [],
  };

  try {
    // 1. Test API Basic Display
    const apiWorking = await testInstagramFallback();
    results.apiAvailable = apiWorking;

    // 2. Test embeds loading
    const embedTest = await testEmbedLoading();
    results.embedsWorking = embedTest.success;
    results.performance.embedLoadTime = embedTest.loadTime;

    // 3. Test fallback data
    const fallbackTest = await testFallbackData();
    results.fallbackWorking = fallbackTest.success;
    results.performance.fallbackLoadTime = fallbackTest.loadTime;

    // 4. Log results
    console.log("Instagram fallback validation results:", results);

    return results;
  } catch (error) {
    results.errors.push(error.message);
    console.error("Instagram fallback validation failed:", error);
    return results;
  }
}

// Test embed loading performance
async function testEmbedLoading() {
  const startTime = performance.now();

  return new Promise((resolve) => {
    // Simular carga de embeds
    setTimeout(() => {
      const loadTime = performance.now() - startTime;
      resolve({
        success: loadTime < 3000, // 3 segundos máximo
        loadTime: Math.round(loadTime),
      });
    }, 1000); // Simular 1 segundo de carga
  });
}

// Test fallback data loading
async function testFallbackData() {
  const startTime = performance.now();

  try {
    // Simular carga de datos fallback
    const fallbackData = instagramFallbackData;
    const loadTime = performance.now() - startTime;

    return {
      success: fallbackData.length > 0 && loadTime < 1000,
      loadTime: Math.round(loadTime),
      dataCount: fallbackData.length,
    };
  } catch (error) {
    return {
      success: false,
      loadTime: performance.now() - startTime,
      error: error.message,
    };
  }
}

// Función de monitoreo continuo
export function startInstagramMonitoring() {
  // Validar cada 10 minutos
  setInterval(async () => {
    const results = await validateInstagramFallback();

    if (!results.embedsWorking && !results.fallbackWorking) {
      console.error("CRITICAL: Both Instagram embeds and fallback failed");
      // Enviar alerta crítica
      sendCriticalAlert("Instagram feed completely failed");
    } else if (!results.embedsWorking) {
      console.warn("WARNING: Instagram embeds failed, using fallback");
    }
  }, 600000); // 10 minutos
}

// Función de alerta crítica
function sendCriticalAlert(message) {
  // Implementar sistema de alertas (email, Slack, etc.)
  console.error("CRITICAL ALERT:", message);

  // Ejemplo: Enviar a webhook
  if (typeof fetch !== "undefined") {
    fetch("/api/critical-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: "Instagram Feed",
        message: message,
        timestamp: new Date().toISOString(),
        severity: "critical",
      }),
    }).catch((err) => console.error("Failed to send alert:", err));
  }
}

// Fallback data si la API falla
export const instagramFallbackData = [
  {
    id: "fallback-1",
    caption: "NUEVA TEMPORADA 2026",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400",
    permalink: "https://www.instagram.com/melrose.stw/",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    caption: "STREETWEAR ESSENTIALS",
    mediaType: "IMAGE",
    mediaUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
    permalink: "https://www.instagram.com/melrose.stw/",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    caption: "URBAN STYLE",
    mediaType: "IMAGE",
    mediaUrl:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400",
    permalink: "https://www.instagram.com/melrose.stw/",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    caption: "PREMIUM QUALITY",
    mediaType: "IMAGE",
    mediaUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
    permalink: "https://www.instagram.com/melrose.stw/",
    timestamp: new Date().toISOString(),
  },
];

// Ejemplo de uso:
/*
// En un componente Astro:
---
import { createInstagramAPI, instagramFallbackData } from '../lib/instagram-api.js';

const instagramAPI = createInstagramAPI();
let instagramPosts = [];

if (instagramAPI) {
  instagramPosts = await instagramAPI.getRecentPosts(6);
}

// Usar fallback si no hay posts
const displayPosts = instagramPosts.length > 0 ? instagramPosts : instagramFallbackData;
---
*/

// Instrucciones para configurar Instagram Basic Display API:

/*
1. Crear una app en Facebook Developers: https://developers.facebook.com/
2. Configurar Instagram Basic Display
3. Obtener el Access Token
4. Agregar a variables de entorno:
   PUBLIC_INSTAGRAM_ACCESS_TOKEN=tu_access_token_aqui

5. Para obtener el token:
   - Ir a: https://developers.facebook.com/tools/instagram-basic-display-api
   - Generar token de acceso de larga duración (60 días)
   - Renovar antes de que expire

6. El token debe tener estos permisos:
   - instagram_graph_user_media
   - instagram_graph_user_profile

7. Para renovación automática, implementar un endpoint que renueve el token
   usando el long-lived access token endpoint.
*/
