import { createClient } from "@supabase/supabase-js";

// ==========================================================
// PASTE YOUR SUPABASE URL AND PUBLIC KEY HERE IF THEY CHANGE:
// ==========================================================
const SUPABASE_URL = "https://myfunqiyvlsjwgpscmzs.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_CnJn5YV1Zq97D7xYZ0OSBQ_DIslXon_";

// Create and export a single initialized Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
