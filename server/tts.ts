import textToSpeech from "@google-cloud/text-to-speech";

import fs from "fs";

let apiKey;

try {
  const secretFiles = fs.readdirSync("/run/secrets/");
  const secrets = fs
    .readFileSync(`/run/secrets/${secretFiles[0]}`, "utf8")
    .trim();
  apiKey = JSON.parse(secrets).GOOGLE_API_KEY;
} catch (error) {
  apiKey = process.env.GOOGLE_API_KEY;
}

const client = new textToSpeech.TextToSpeechClient({
  apiKey,
});

export default client;
