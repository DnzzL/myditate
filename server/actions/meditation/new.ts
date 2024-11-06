import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import fs from "fs";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Database } from "~/server/database.types";
import openai from "~/server/openai";
import getScriptPrompt from "~/server/prompts/script";

const newMeditationSchema = zfd.formData({
  topic: zfd.text(),
  duration: zfd.numeric(z.number().min(2).max(10)),
  voice: zfd.text(),
  backgroundSound: zfd.text(),
});

export default defineFormActions({
  add: async (event) => {
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
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
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

        script = response.choices[0].message.content ?? "";
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

      // const mp3 = await openai.audio.speech.create({
      //   model: "tts-1",
      //   voice: "shimmer",
      //   input: script,
      // });
      // const buffer = Buffer.from(await mp3.arrayBuffer());
      // // save local file
      // fs.writeFileSync(`${meditation.topic}.mp3`, buffer);

      const buffer = fs.readFileSync(`${meditation.topic}.mp3`);

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
