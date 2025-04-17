
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://owtffpanpqcwumhqkkhl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93dGZmcGFucHFjd3VtaHFra2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjgwODYsImV4cCI6MjA2MDQ0NDA4Nn0.2tDXfgVPNN2A9j0NSyR0PxtyJUDuQ_PCPoIHnrojEGM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
