import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { Database } from "../../database.types";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not authenticated",
    });
  }
  const client = await serverSupabaseClient<Database>(event);

  const { data: meditations, error } = await client
    .from("meditations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return meditations;
});
