import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhlgpgurjjiiooebsouf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obGdwZ3VyamppaW9vZWJzb3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMzIxNTEsImV4cCI6MjA0NTkwODE1MX0.W-SkTjLHni4SBBXTu0Ae_g9K9rM4HF-tJ9MgQ1VcXqc';

export const database = createClient(supabaseUrl, supabaseAnonKey);
