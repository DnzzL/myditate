import { OpenAI } from "openai";

import fs from "fs";

let apiKey;

try {
  const secretFiles = fs.readdirSync("/run/secrets/");
  const secrets = fs
    .readFileSync(`/run/secrets/${secretFiles[0]}`, "utf8")
    .trim();
  apiKey = JSON.parse(secrets).OPENAI_API_KEY;
} catch (error) {
  apiKey = process.env.OPENAI_API_KEY;
}

const openai = new OpenAI({
  apiKey,
});

export default openai;
