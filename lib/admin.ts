import { supabase } from "@/lib/supabase";

export async function fetchIsAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) {
    console.error("is_admin failed", error);
    return false;
  }
  return Boolean(data);
}
