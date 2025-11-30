import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Helper to get env vars in Vite (Frontend) environment
const getEnvVar = (key: string): string => {
  // Check Vite import.meta.env
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key] as string;
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Supabase credentials missing in frontend.');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);
