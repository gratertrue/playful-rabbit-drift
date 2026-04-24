import { createClient } from '@supabase/supabase-js';

// Mengambil variabel lingkungan dari Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Pastikan client hanya dibuat jika kredensial tersedia untuk mencegah error startup
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Mengembalikan null jika belum dikonfigurasi

// Helper untuk mengecek apakah supabase siap digunakan
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);