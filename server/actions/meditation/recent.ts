import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { Database } from "../../database.types";

export const loader = defineServerLoader(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw new Error("User not authenticated");
  }
  const client = await serverSupabaseClient<Database>(event);

  const { data: meditations, error } = await client
    .from("meditations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw error;
  }

  return { meditations };
});
