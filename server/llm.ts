import { Mistral } from "@mistralai/mistralai";
import fs from "fs";

let apiKey;

try {
  const secretFiles = fs.readdirSync("/run/secrets/");
  const secrets = fs
    .readFileSync(`/run/secrets/${secretFiles[0]}`, "utf8")
    .trim();
  apiKey = JSON.parse(secrets).MISTRAL_API_KEY;
} catch (error) {
  apiKey = process.env.MISTRAL_API_KEY;
}

const mistral = new Mistral({
  apiKey,
});

export default mistral;
