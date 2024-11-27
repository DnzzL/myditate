import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { z } from "zod";

const schema = z.object({
  default_language: z.enum(["English", "Français"]),
  default_voice: z
    .enum(["calm female", "uplifting male"])
    .default("calm female"),
  default_duration: z.number().int().min(5).max(30),
});

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not authenticated",
    });
  }
  const body = await readValidatedBody(event, (body) => schema.safeParse(body));
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }

  const languageCode = body.data.default_language === "English" ? "en" : "fr";
  const { data, error } = await client
    .from("user_preferences")
    .upsert({
      user_id: user.id,
      ...body.data,
      default_language: languageCode,
    })
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
  return data;
});
