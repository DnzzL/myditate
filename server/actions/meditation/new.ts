import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Database } from "~/server/database.types";
import llm from "~/server/llm";
import getScriptPrompt from "~/server/prompts/script";
import tts from "~/server/tts";

const newMeditationSchema = zfd.formData({
  topic: zfd.text(),
  duration: zfd.numeric(z.number().min(2).max(10)),
  voice: zfd.text(),
  backgroundSound: zfd.text(),
});

export default defineFormActions({
  default: async (event) => {
    console.log("Add meditation");
    const formData = await readFormData(event);
    const meditation = newMeditationSchema.parse(formData.entries());

    try {
      const user = await serverSupabaseUser(event);
      if (!user) {
        return actionResponse(
          event,
          {},
          { error: { message: "User not authenticated" } }
        );
      }
      const client = await serverSupabaseClient<Database>(event);

      const scriptPrompt = getScriptPrompt({
        topic: meditation.topic,
        duration: meditation.duration,
        voiceTone: meditation.voice,
      });

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
          return actionResponse(
            event,
            { meditation },
            { error: { code: 422, message: e?.message } }
          );
        }
      }
      console.log("Script", script);

      const request = {
        input: { ssml: script },
        voice: { languageCode: "en-US", name: "en-GB-Wavenet-C" },
        audioConfig: { audioEncoding: "MP3" },
      };

      let buffer;
      try {
        const [response] = await tts.synthesizeSpeech(request);
        buffer = Buffer.from(response.audioContent);
      } catch (e) {
        if (e instanceof Error) {
          return actionResponse(
            event,
            { meditation },
            { error: { code: 500, message: e?.message } }
          );
        }
      }

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
        return actionResponse(
          event,
          { meditation },
          { error: { code: 500, message: audioUploadError?.message } }
        );
      }

      const { data: audioEntryId, error: audioSaveError } = await client
        .from("audio_files")
        .insert({
          duration: meditation.duration,
          url: audioFile?.path,
        })
        .select("id");
      if (audioSaveError) {
        return actionResponse(
          event,
          { meditation },
          { error: { code: 500, message: audioSaveError?.message } }
        );
      }

      const { data: created, error: saveError } = await client
        .from("meditations")
        .insert({
          topic: meditation.topic,
          duration: meditation.duration,
          voice: meditation.voice,
          script,
          audio_id: audioEntryId[0].id,
          background_sound: null,
          user_id: user.id,
        })
        .select("id")
        .single();
      if (saveError) {
        return actionResponse(
          event,
          { meditation },
          { error: { code: 500, message: saveError?.message } }
        );
      }

      const redirectUrl = `/meditation/ready?id=${created.id}&topic=${meditation.topic}&duration=${meditation.duration}&voice=${meditation.voice}&backgroundSound=${meditation.backgroundSound}&audioUrl=${audioFile?.fullPath}`;
      return actionResponse(event, { meditation }, { redirect: redirectUrl });
    } catch (e) {
      if (e instanceof Error) {
        return actionResponse(
          event,
          { meditation },
          { error: { code: 422, message: e?.message } }
        );
      }
    }
  },
});
