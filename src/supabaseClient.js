import { createClient } from '@supabase/supabase-js';

// Ortam de�i�kenlerini .env dosyas�ndan al�yoruz.
// NOT: .env dosyan�zda REACT_APP_SUPABASE_URL ve REACT_APP_SUPABASE_ANON_KEY tan�ml� olmal�!
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL veya Anon Key eksik. L�tfen .env dosyan�z� kontrol edin.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);