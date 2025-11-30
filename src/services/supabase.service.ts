import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Helper to get env vars in both Node.js (Backend) and Vite (Frontend) environments
const getEnvVar = (key: string): string => {
  // Check Node.js process.env
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

console.log('Debug: Supabase connection:', {
  supabaseUrl: supabaseUrl ? 'Found' : 'Missing',
  supabaseKey: supabaseKey ? 'Found' : 'Missing'
});

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Supabase credentials missing. Please check your .env file.');
  console.error('See SETUP.md for instructions.');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);
