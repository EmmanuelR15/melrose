
import { supabase } from './src/lib/supabase.js';

async function checkTable() {
  if (!supabase) {
    console.log("No supabase client");
    return;
  }
  const { data, error } = await supabase.from('categorias').select('*').limit(1);
  if (error) {
    console.log("Error or table missing:", error.message);
  } else {
    console.log("Table 'categorias' exists and is accessible.");
  }
}

checkTable();
