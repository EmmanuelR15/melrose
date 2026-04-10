// Supabase Trends Integration para Lookbook
import { supabase } from './supabase.js';

// Obtener tendencias editoriales desde Supabase
export async function getTrends(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('tendencias')
      .select('*')
      .eq('activa', true)
      .order('orden', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener tendencias:', error);
    return [];
  }
}

// Obtener tendencia específica por ID
export async function getTrendById(id) {
  try {
    const { data, error } = await supabase
      .from('tendencias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al obtener tendencia:', error);
    return null;
  }
}

// Estructura sugerida para tabla 'tendencias' en Supabase:
/*
CREATE TABLE tendencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  subtitulo TEXT,
  imagen_url TEXT NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  orden INTEGER DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ejemplo de datos:
INSERT INTO tendencias (titulo, subtitulo, imagen_url, descripcion, categoria, orden) VALUES
('URBAN ESSENTIALS', 'Lo básico con actitud', 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea', 'Piezas fundamentales para el día a día urbano', 'basics', 1),
('CITY NIGHT', 'Estilo nocturno', 'https://images.unsplash.com/photo-1509631179647-0177331693ae', 'Looks perfectos para salir de noche', 'noche', 2),
('DEEP COLOR', 'Colores intensos', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990', 'Paleta de colores profundos y vibrantes', 'colores', 3),
('CLEAN LINES', 'Siluetas limpias', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', 'Líneas puras y minimalistas', 'minimalista', 4),
('STREETWEAR PREMIUM', 'Alta gama urbana', 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8', 'Streetwear con toque premium', 'premium', 5),
('TEXTURE PLAY', 'Juego de texturas', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', 'Combinación de texturas interesantes', 'texturas', 6);
*/
