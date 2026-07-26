import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjgmcxoqcocqrtomuvhf.supabase.co';
const supabaseKey = 'sb_publishable_62iz3ioR9eBHjbnLpD-MZQ_c7_FN02x';

export const supabase = createClient(supabaseUrl, supabaseKey);
