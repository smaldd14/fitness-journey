import { createClient, SupabaseClient } from '@supabase/supabase-js'
import config from './config'

const supabase: SupabaseClient = createClient(config.supabase.url, config.supabase.apiKey);

export const auth = supabase.auth
export const storage = supabase.storage
export const functions = supabase.functions

export default supabase;