import { createClient } from '@supabase/supabase-js';

// Ortam deðiþkenlerini .env dosyasýndan alýyoruz.
// NOT: .env dosyanýzda REACT_APP_SUPABASE_URL ve REACT_APP_SUPABASE_ANON_KEY tanýmlý olmalý!
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL veya Anon Key eksik. Lütfen .env dosyanýzý kontrol edin.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);