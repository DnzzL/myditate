import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { z } from "zod";
import { Database } from "~/server/database.types";
import llm from "~/server/llm";
import getScriptPrompt from "~/server/prompts/script";
import tts from "~/server/tts";

const newMeditationSchema = z.object({
  topic: z.string(),
  duration: z.array(z.number()),
  voice: z.string(),
  backgroundSound: z.string(),
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    newMeditationSchema.safeParse(body)
  );
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Bad Request",
    });
  }
  const meditation = result.data;

  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "User not authenticated",
      });
    }
    const client = await serverSupabaseClient<Database>(event);

    const scriptPrompt = getScriptPrompt({
      topic: meditation.topic,
      duration: meditation.duration[0],
      voiceTone: meditation.voice,
    });

    console.log("Generate script");
    let script = "";
    try {
      const response = await llm.chat.complete({
        model: "open-mixtral-8x22b",
        messages: [
          {
            role: "system",
            content: "You are a meditation guide.",
          },
          {
            role: "user",
            content: scriptPrompt,
          },
        ],
      });

      script = response.choices?.[0]?.message?.content ?? "";
    } catch (e) {
      if (e instanceof Error) {
        throw createError({
          statusCode: 500,
          message: "Script: " + e?.message,
        });
      }
    }

    console.log("Generate audio");
    const request = {
      input: { ssml: script },
      voice: { languageCode: "fr-FR", name: "fr-FR-Wavenet-C" },
      audioConfig: { audioEncoding: "MP3" },
    };
    let buffer;
    try {
      const [response] = await tts.synthesizeSpeech(request);
      buffer = Buffer.from(response.audioContent);
    } catch (e) {
      if (e instanceof Error) {
        throw createError({
          statusCode: 500,
          message: "TTS: " + e?.message,
        });
      }
    }

    console.log("Upload audio");
    const { data: audioFile, error: audioUploadError } = await client.storage
      .from("meditations")
      .upload(
        `${user.id}/${meditation.topic}-${new Date().getTime()}`,
        buffer,
        {
          cacheControl: "3600",
          contentType: "audio/mpeg",
          upsert: false,
        }
      );
    if (audioUploadError) {
      throw createError({
        statusCode: 500,
        message: "Upload: " + audioUploadError?.message,
      });
    }

    console.log("Save audio file");
    const { data: audioEntryId, error: audioSaveError } = await client
      .from("audio_files")
      .insert({
        duration: meditation.duration[0],
        url: audioFile?.path,
      })
      .select("id");
    if (audioSaveError) {
      throw createError({
        statusCode: 500,
        message: "Audio Save: " + audioSaveError?.message,
      });
    }

    console.log("Save meditation");
    const { data: created, error: saveError } = await client
      .from("meditations")
      .insert({
        topic: meditation.topic,
        duration: meditation.duration[0],
        voice: meditation.voice,
        script,
        audio_id: audioEntryId[0].id,
        background_sound: null,
        user_id: user.id,
      })
      .select("id")
      .single();
    if (saveError) {
      throw createError({
        statusCode: 500,
        message: "Meditation Save: " + saveError?.message,
      });
    }

    return `/meditation/ready?id=${created.id}&topic=${meditation.topic}&duration=${meditation.duration}&voice=${meditation.voice}&backgroundSound=${meditation.backgroundSound}&audioUrl=${audioFile?.fullPath}`;
  } catch (e) {
    if (e instanceof Error) {
      throw createError({
        statusCode: 500,
        message: e?.message,
      });
    }
  }
});
