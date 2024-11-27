import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { QueryData } from "@supabase/supabase-js";
import { Database } from "../../../database.types";

export default defineEventHandler(async (event) => {
  const meditationId = getRouterParam(event, "id");
  if (!meditationId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Meditation ID is required",
    });
  }

  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not authenticated",
    });
  }
  const client = await serverSupabaseClient<Database>(event);

  const meditationWithAudioQuery = client
    .from("meditations")
    .select(`*, audio_files (url)`)
    .eq("id", meditationId)
    .eq("user_id", user.id)
    .single();
  type MeditationWithAudioQuery = QueryData<typeof meditationWithAudioQuery>;

  const { data, error: meditationError } = await meditationWithAudioQuery;
  const meditation = data as MeditationWithAudioQuery;

  if (meditationError) throw meditationError;
  if (!meditation) throw new Error("Meditation not found");

  if (!meditation.audio_files?.url) {
    throw createError({
      statusCode: 404,
      statusMessage: "Meditation has no audio file",
    });
  }

  return meditation;
});
