import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not authenticated",
    });
  }

  const { data } = await client
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();
  return data;
});
