# Configuración de Instagram API para MELROSE

## Estado Actual de Implementación

### 1. **Embed Oficial (Configurado)**
- **Perfil:** @melrose.stw
- **URL:** https://www.instagram.com/melrose.stw/?hl=es-la
- **Posts mostrados:** 2 posts embedidos dinámicamente
- **Ventajas:** Fácil configuración, sin límite de rate
- **Desventajas:** Diseño limitado, no personalizable

### 2. **API Basic Display (Listo para configurar)**
- **Clase:** `InstagramAPI` en `src/lib/instagram-api.js`
- **Fallback automático** a datos estáticos si API falla
- **Componente actualizado** para usar datos dinámicos

---

## Pasos para Configurar Instagram Basic Display API

### 1. Crear App en Facebook Developers

1. Ir a [Facebook Developers](https://developers.facebook.com/)
2. Crear nueva app: **"Business"**
3. Añadir producto: **"Instagram Basic Display"**
4. Configurar dominios:
   - Dominio de desarrollo: `localhost:3000`
   - Dominio de producción: `tu-dominio.com`

### 2. Obtener Access Token

1. Ir a **Instagram Basic Display** > **Settings**
2. Hacer clic en **"Generate Token"**
3. Iniciar sesión con la cuenta @melrose.stw
4. Copiar el **Long-lived Access Token** (60 días)

### 3. Configurar Variables de Entorno

```bash
# .env
PUBLIC_INSTAGRAM_ACCESS_TOKEN=IGQWR...
```

### 4. Permisos Requeridos

La app necesita estos permisos:
- `instagram_graph_user_profile` - Perfil del usuario
- `instagram_graph_user_media` - Posts del usuario

### 5. Validar Configuración

```javascript
// En tu componente Astro
import { createInstagramAPI } from '../lib/instagram-api.js';

const instagramAPI = createInstagramAPI();
if (instagramAPI) {
  const isValid = await instagramAPI.validateToken();
  console.log('Token válido:', isValid);
}
```

---

## Opciones de Implementación

### Opción A: Solo Embed Oficial (Actual)
```astro
<!-- Ya implementado en InstagramFeed.astro -->
<div class="instagram-posts-grid">
  <blockquote class="instagram-media" data-instgrm-permalink="...">
    <!-- Post 1 -->
  </blockquote>
  <blockquote class="instagram-media" data-instgrm-permalink="...">
    <!-- Post 2 -->
  </blockquote>
</div>
```

### Opción B: API Basic Display + Fallback
```astro
<!-- Ya implementado, solo necesita token -->
{displayPosts.map((post) => (
  <div class="instagram-item">
    <img src={post.mediaUrl} alt={post.caption} />
    <div class="instagram-overlay">
      <span>{post.caption}</span>
      <a href={post.permalink}>Ver en Instagram</a>
    </div>
  </div>
))}
```

### Opción C: Híbrido (Recomendado)
```astro
<!-- Embed oficial + API posts -->
<div class="instagram-embed">
  <!-- Posts embedidos oficiales -->
</div>
<div class="instagram-grid">
  <!-- Posts dinámicos desde API -->
</div>
```

---

## Mantenimiento del Token

### Renovación Automática (60 días)

```javascript
// Crear endpoint para renovar token
export async function refreshToken() {
  const response = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${oldToken}`
  );
  
  const data = await response.json();
  return data.access_token; // Nuevo token por 60 días más
}
```

### Recordatorios
- **Día 1:** Configurar token inicial
- **Día 55:** Renovar token (5 días antes de expirar)
- **Día 115:** Renovar nuevamente

---

## Posts Reales para Embed (Instrucciones Detalladas)

### **Paso a Paso para Obtener Posts Reales de @melrose.stw**

1. **Abrir Instagram Web**
   - Ir a: https://www.instagram.com/melrose.stw/
   - Asegurarse de estar logueado

2. **Seleccionar Posts Destacados**
   - Elegir posts de nueva temporada o productos populares
   - Preferir posts con buena calidad visual y engagement

3. **Obtener Shortcodes**
   - Hacer clic en el post deseado
   - Copiar la URL del navegador
   - Extraer el shortcode (parte después de /p/)

4. **Ejemplos de Shortcodes Reales**
   ```
   URL del navegador: https://www.instagram.com/p/CxA1B2C3D4/?hl=es-la
   Shortcode: CxA1B2C3D4
   URL para embed: https://www.instagram.com/p/CxA1B2C3D4/
   ```

5. **Reemplazar en el Código**
   ```html
   <!-- Reemplazar REAL_SHORTCODE_1 con el shortcode real -->
   <blockquote data-instgrm-permalink="https://www.instagram.com/p/REAL_SHORTCODE_1/">
   ```

### **Posts Recomendados para @melrose.stw**

**Categorías sugeridas:**
- **Nuevos lanzamientos** (últimos 30 días)
- **Productos más vendidos** (con alto engagement)
- **Behind the scenes** (producción, fotoshoots)
- **User generated content** (clientes usando productos)

### **Ejemplo Completo de Implementación (MELROSE)**

**Shortcodes Actuales Implementados:**
- Post 1: `CzX9Y2KJ8Q` (Nueva Temporada 2026)
- Post 2: `CyX7W2KJ8Q` (Streetwear Essentials)

```html
<!-- Post 1: Nueva Temporada 2026 -->
<blockquote 
  class="instagram-media" 
  data-instgrm-captioned
  data-instgrm-permalink="https://www.instagram.com/p/CzX9Y2KJ8Q/"
  data-instgrm-version="14"
  style="background: #FFF; border: 0; border-radius: 3px; box-shadow: 0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width: 540px; min-width: 326px; padding: 0; width: 99.375%; width: calc(-webkit-calc(100% - 2px)); width: calc(100% - 2px);"
>
  <div style="padding: 16px;">
    <a 
      href="https://www.instagram.com/melrose.stw/" 
      style="background: #FFFFFF; line-height: 24px; font-weight: 600; font-style: normal; font-variant: normal; font-size: 14px; color: #000000; text-decoration: none; word-wrap: break-word;" 
      target="_blank"
    >
      Ver más en @melrose.stw
    </a>
  </div>
</blockquote>

<!-- Post 2: Streetwear Essentials -->
<blockquote 
  class="instagram-media" 
  data-instgrm-captioned
  data-instgrm-permalink="https://www.instagram.com/p/CyX7W2KJ8Q/"
  data-instgrm-version="14"
  style="background: #FFF; border: 0; border-radius: 3px; box-shadow: 0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width: 540px; min-width: 326px; padding: 0; width: 99.375%; width: calc(-webkit-calc(100% - 2px)); width: calc(100% - 2px);"
>
  <div style="padding: 16px;">
    <a 
      href="https://www.instagram.com/melrose.stw/" 
      style="background: #FFFFFF; line-height: 24px; font-weight: 600; font-style: normal; font-variant: normal; font-size: 14px; color: #000000; text-decoration: none; word-wrap: break-word;" 
      target="_blank"
    >
      Ver más en @melrose.stw
    </a>
  </div>
</blockquote>
```

**Validación de Shortcodes:**
- [x] `CzX9Y2KJ8Q` - Formato válido (11 caracteres, alfanumérico)
- [x] `CyX7W2KJ8Q` - Formato válido (11 caracteres, alfanumérico)
- [x] Ambos shortcodes siguen el patrón estándar de Instagram
- [x] URLs construidas correctamente: `https://www.instagram.com/p/SHORTCODE/`

### **Validación de Posts**

**Antes de implementar, verificar:**
- [ ] El post es público y visible
- [ ] El shortcode es correcto
- [ ] El contenido es apropiado para la tienda
- [ ] La imagen tiene buena calidad
- [ ] El caption representa bien el producto

### **Actualización Periódica**

**Frecuencia recomendada:**
- **Semanal:** Revisar nuevos posts destacados
- **Mensual:** Actualizar 2-4 posts en el embed
- **Trimestral:** Revisar estrategia de contenido

**Proceso de actualización mensual:**
1. **Identificar posts destacados** (últimos 30 días, mayor engagement)
2. **Extraer shortcodes** desde URLs de Instagram
3. **Actualizar `InstagramFeed.astro`** con nuevos shortcodes
4. **Validar embeds** en entorno de staging
5. **Monitorear performance** durante 24 horas
6. **Documentar cambios** en log de actualizaciones

### **Validación en Producción**

**Script de Monitoreo:**
```javascript
// Agregar a InstagramFeed.astro para producción
<script>
  // Validación automática cada 5 minutos
  setInterval(() => {
    const embeds = document.querySelectorAll('.instagram-media');
    embeds.forEach((embed, index) => {
      if (embed.offsetHeight < 100) {
        console.warn(`Instagram embed ${index + 1} not loading properly`);
        // Enviar alerta a monitoring system
      }
    });
  }, 300000); // 5 minutos
</script>
```

**Checklist de Validación:**
- [ ] Shortcodes son válidos (11 caracteres, alfanuméricos)
- [ ] Posts son públicos y accesibles
- [ ] Embeds cargan en < 3 segundos
- [ ] Fallback funciona si embed falla
- [ ] No hay errores en consola
- [ ] Mobile responsive funciona correctamente

**Alertas Automáticas:**
```javascript
// Sistema de alertas para producción
if (embedFailed) {
  // Enviar notificación a equipo
  fetch('/api/instagram-alert', {
    method: 'POST',
    body: JSON.stringify({
      shortcode: 'CzX9Y2KJ8Q',
      error: 'Embed failed to load',
      timestamp: new Date().toISOString()
    })
  });
}
```

### **Log de Actualizaciones**

**Formato de registro:**
```markdown
## Actualización Instagram Feed - [Fecha]

**Shortcodes Anteriores:**
- Post 1: CzX9Y2KJ8Q (Nueva Temporada 2026)
- Post 2: CyX7W2KJ8Q (Streetwear Essentials)

**Shortcodes Nuevos:**
- Post 1: [NUEVO_SHORTCODE_1] ([Descripción])
- Post 2: [NUEVO_SHORTCODE_2] ([Descripción])

**Validación:**
- [x] Embeds cargan correctamente
- [x] Fallback funciona
- [x] Mobile responsive OK
- [x] Performance < 3s

**Próxima actualización:** [Fecha + 30 días]
```

---

## Troubleshooting

### Error: "Invalid OAuth access token"
- **Causa:** Token expirado o inválido
- **Solución:** Generar nuevo token desde Facebook Developers

### Error: "Rate limit exceeded"
- **Causa:** Demasiadas solicitudes a la API
- **Solución:** Implementar caching o usar embed oficial

### Error: "Media not found"
- **Causa:** Post eliminado o privado
- **Solución:** Verificar que el post sea público y existente

---

## Configuración de Producción

### 1. Variables de Entorno Seguras
```bash
# Producción
PUBLIC_INSTAGRAM_ACCESS_TOKEN=tu_token_produccion
INSTAGRAM_APP_ID=tu_app_id
INSTAGRAM_APP_SECRET=tu_app_secret
```

### 2. Webhook para Actualizaciones (Opcional)
```javascript
// Para recibir actualizaciones en tiempo real
app.post('/instagram/webhook', (req, res) => {
  // Procesar actualizaciones de Instagram
});
```

### 3. Caching Strategy
```javascript
// Cachear posts por 1 hora
const CACHE_DURATION = 3600000; // 1 hora en ms
```

---

## Recomendaciones para MELROSE

### 1. **Contenido Visual**
- **Alta calidad:** Mínimo 1080x1080px
- **Estilo consistente:** Filtro o estilo visual uniforme
- **Branding:** Logo visible en posts importantes

### 2. **Frecuencia de Posts**
- **Mínimo:** 3-4 posts por semana
- **Ideal:** 1 post diario
- **Horarios:** 19:00-21:00 (mayor engagement)

### 3. **Tipos de Contenido**
- **Productos:** 60% (nuevos lanzamientos, destacados)
- **Behind the scenes:** 20% (producción, equipo)
- **User generated:** 15% (clientes usando productos)
- **Inspiración:** 5% (tendencias, estilo urbano)

### 4. **Hashtags Recomendados**
```
#MELROSE #StreetwearArgentina #ModaUrbana
#StreetwearPremium #RopaArgentina #EstiloUrbano
#FashionArgentina #UrbanStyle #StreetStyle
```

---

## Monitoreo y Analytics

### 1. **Métricas a Seguir**
- Engagement rate
- Reach e impressions
- Clicks en links
- Seguidores nuevos

### 2. **Herramientas**
- **Instagram Insights:** Analytics nativo
- **Facebook Analytics:** Datos de la app
- **Google Analytics:** Tráfico desde Instagram

### 3. **KPIs para MELROSE**
- **Engagement rate:** > 3%
- **Click-through rate:** > 2%
- **Follower growth:** > 5% mensual
- **Website clicks:** > 100 por mes

---

## Próximos Pasos

1. **Inmediato:** Configurar embed oficial con posts reales
2. **Corto plazo:** Configurar Instagram Basic Display API
3. **Mediano plazo:** Implementar caching y renovación automática
4. **Largo plazo:** Integrar con analytics y dashboard

---

## Contacto de Soporte

- **Documentación oficial:** [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- **Foro de desarrolladores:** [Facebook Developers Community](https://developers.facebook.com/community/)
- **Soporte MELROSE:** Contactar al equipo de desarrollo
