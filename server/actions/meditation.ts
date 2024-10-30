import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { z } from "zod";
import { Database } from "../database.types";

const newMeditationSchema = z.object({
  topic: z.string(),
  duration: z.number().array(),
  voice: z.string(),
  backgroundSound: z.string(),
  audioUrl: z.string().url(),
});

export default defineFormActions({
  delete: async (event) => {},
});

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
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return { meditations };
});
