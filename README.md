# Melrose

Ecommerce de ropa estatico (HTML + CSS + JavaScript vanilla) con Supabase como backend.

## Setup en 5 pasos

1. Crea un proyecto en Supabase y abre SQL Editor.
2. Pega y ejecuta el contenido de `supabase-schema.sql`.
3. Copia tu Project URL y Anon Key.
4. En `script.js`, reemplaza:
   - `const SUPABASE_URL = 'TU_SUPABASE_URL'`
   - `const SUPABASE_KEY = 'TU_SUPABASE_ANON_KEY'`
5. Abre `index.html` en el navegador (doble click) y luego `admin.html` para gestionar productos.

## Notas

- Si no configuras Supabase, la tienda carga 6 productos de ejemplo (fallback) para que no quede vacia.
- El carrito se guarda en `localStorage`.
- El acceso admin usa password hardcodeada: `melrose2024`.
