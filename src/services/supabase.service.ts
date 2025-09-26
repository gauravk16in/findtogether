import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Hardcode the values for now since env variables aren't loading properly in Vite
const supabaseUrl = 'https://fyxtgfgnrqweddwrlzkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eHRnZmducnF3ZWRkd3JsemtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NjI0MzEsImV4cCI6MjA3NDQzODQzMX0.-8FcZtDYAnFVT7AOoiQGLkWfJXobtci7-22SZ2EdHwg';

console.log('Debug: Supabase connection:', {
  supabaseUrl: supabaseUrl ? 'loaded' : 'missing',
  supabaseKey: supabaseKey ? 'loaded' : 'missing'
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
