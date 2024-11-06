import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { QueryData } from "@supabase/supabase-js";
import { z } from "zod";
import { Database } from "../../database.types";

export const loader = defineServerLoader(async (event) => {
  const params = getQuery(event);
  const meditationId = z.string().parse(params.id);

  const user = await serverSupabaseUser(event);
  if (!user) {
    throw new Error("User not authenticated");
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

  if (!meditation.audio_files?.url)
    throw new Error("Meditation has no audio file");

  return {
    meditation,
  };
});
