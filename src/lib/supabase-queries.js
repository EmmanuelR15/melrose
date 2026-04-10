// Supabase Queries Helper - Ejemplos para MELROSE

import { supabase } from "./supabase.js";

// ==================== PRODUCTOS ====================

// Obtener producto por ID (para página de detalle)
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(category, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("categoria", category)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return [];
  }
}

// Obtener productos relacionados (misma categoría, excluyendo el actual, solo con stock)
export async function getRelatedProducts(
  currentProductId,
  category,
  limit = 4,
) {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("categoria", category)
      .neq("id", currentProductId)
      .gt("stock", 0) // Solo productos con stock disponible
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener productos relacionados:", error);
    return [];
  }
}

// Obtener productos relacionados con múltiples criterios
export async function getRelatedProductsAdvanced(
  currentProductId,
  category,
  priceRange = null,
  limit = 4,
) {
  try {
    let query = supabase
      .from("productos")
      .select("*")
      .neq("id", currentProductId);

    // Filtro por categoría
    if (category && category !== "TODO") {
      query = query.eq("categoria", category);
    }

    // Filtro por rango de precio (±30% del precio actual)
    if (priceRange) {
      const minPrice = priceRange * 0.7;
      const maxPrice = priceRange * 1.3;
      query = query.gte("precio", minPrice).lte("precio", maxPrice);
    }

    // Solo productos con stock
    query = query.gt("stock", 0);

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener productos relacionados avanzados:", error);
    return [];
  }
}

// Obtener productos "comprados juntos" (basado en categoría y precio similar)
export async function getFrequentlyBoughtTogether(
  currentProductId,
  category,
  price,
  limit = 3,
) {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("categoria", category)
      .neq("id", currentProductId)
      .gte("precio", price * 0.8)
      .lte("precio", price * 1.2)
      .gt("stock", 0)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener productos comprados juntos:", error);
    return [];
  }
}

// Obtener productos más vendidos de la misma categoría
export async function getTopSellingInCategory(category, limit = 4) {
  try {
    // Esta consulta asume que tienes una tabla de ventas o un campo de popularidad
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("categoria", category)
      .gt("stock", 0)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    return [];
  }
}

// Obtener productos con tags similares (si tienes un campo de tags)
export async function getProductsByTags(tags, limit = 4) {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .contains("tags", tags)
      .gt("stock", 0)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener productos por tags:", error);
    return [];
  }
}

// Buscar productos por nombre o descripción
export async function searchProducts(query, category = null) {
  try {
    let supabaseQuery = supabase
      .from("productos")
      .select("*")
      .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);

    if (category && category !== "TODO") {
      supabaseQuery = supabaseQuery.eq("categoria", category);
    }

    const { data, error } = await supabaseQuery.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return [];
  }
}

// Obtener productos con filtros avanzados
export async function getProductsFiltered(filters = {}) {
  try {
    let query = supabase.from("productos").select("*");

    // Filtro por categoría
    if (filters.category && filters.category !== "TODO") {
      query = query.eq("categoria", filters.category);
    }

    // Filtro por precio
    if (filters.minPrice) {
      query = query.gte("precio", filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte("precio", filters.maxPrice);
    }

    // Filtro por stock disponible
    if (filters.inStock) {
      query = query.gt("stock", 0);
    }

    // Ordenamiento
    const orderBy = filters.orderBy || "created_at";
    const orderDirection = filters.orderDirection || "desc";
    query = query.order(orderBy, { ascending: orderDirection === "asc" });

    // Límite
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener productos filtrados:", error);
    return [];
  }
}

// ==================== ESTADÍSTICAS ====================

// Obtener productos más vendidos (requiere tabla de ventas)
export async function getTopSellingProducts(limit = 10) {
  try {
    // Esta consulta asume que tienes una tabla 'ventas' o 'order_items'
    const { data, error } = await supabase
      .from("productos")
      .select(
        `
        *,
        ventas:order_items(count)
      `,
      )
      .gte("ventas.count", 1)
      .order("ventas.count", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    return [];
  }
}

// ==================== CATEGORÍAS ====================

// Obtener todas las categorías disponibles
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("categoria")
      .not("categoria", "is", null);

    if (error) throw error;

    // Eliminar duplicados y ordenar
    const categories = [...new Set(data.map((item) => item.categoria))];
    return categories.sort();
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
}

// ==================== STOCK ====================

// Actualizar stock de producto
export async function updateProductStock(productId, newStock) {
  try {
    const { data, error } = await supabase
      .from("productos")
      .update({ stock: newStock })
      .eq("id", productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al actualizar stock:", error);
    return null;
  }
}

// Verificar disponibilidad de múltiples productos
export async function checkProductsAvailability(productIds) {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("id, nombre, stock")
      .in("id", productIds);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    return [];
  }
}

// ==================== WISHLIST (si se guarda en Supabase) ====================

// Guardar wishlist en Supabase (opcional, alternativa a localStorage)
export async function saveWishlistToSupabase(userId, productIds) {
  try {
    const { data, error } = await supabase
      .from("wishlists")
      .upsert({
        user_id: userId,
        product_ids: productIds,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al guardar wishlist:", error);
    return null;
  }
}

// Obtener wishlist de Supabase
export async function getWishlistFromSupabase(userId) {
  try {
    const { data, error } = await supabase
      .from("wishlists")
      .select("product_ids")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data?.product_ids || [];
  } catch (error) {
    console.error("Error al obtener wishlist:", error);
    return [];
  }
}

// ==================== UTILIDADES ====================

// Formatear precio para Argentina
export function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
}

// Generar slug para URLs amigables
export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[áàâä]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[íìîï]/g, "i")
    .replace(/[óòôö]/g, "o")
    .replace(/[úùûü]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Validar email
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ==================== EJEMPLOS DE USO ====================

/*
// En una página Astro:
---
import { getProductById, getRelatedProducts } from '../lib/supabase-queries.js';

const product = await getProductById(Astro.params.id);
const relatedProducts = await getRelatedProducts(Astro.params.id, product.categoria);
---

// En el cliente (JavaScript):
import { searchProducts, formatPrice } from '../lib/supabase-queries.js';

const results = await searchProducts('remera', 'REMERAS');
const formattedPrice = formatPrice(25000); // "$25.000"
*/
