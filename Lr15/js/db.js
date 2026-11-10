import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://xlyrgsniqzudciglyylx.supabase.co';
const supabaseKey = 'sb_publishable_eDQj5NcqTGzBLDEd6ct9Dg_BE7zFCpr';

export const db = createClient(supabaseUrl, supabaseKey);