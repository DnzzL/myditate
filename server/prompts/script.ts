export default function getScriptPrompt({
  topic,
  duration,
  voiceTone,
}: {
  topic: string;
  duration: number;
  voiceTone: string;
}) {
  const prompt = `
    You are a meditation script writer. Please create a guided meditation script tailored to the following specifics:

    - Topic: ${topic}
    - Duration: Approximately ${duration} minutes
    - Voice Tone: ${voiceTone}

    Script Requirements:
    - Introduction (max 1 minute): Gently guide the listener into a relaxed state. Use ${voiceTone} to set the mood, and incorporate a few deep breathing cues.
    - Body of the Meditation:
      - Craft imagery, affirmations, or visualizations relevant to the topic.
      - Use calming, slow-paced language for relaxation or energy cues for motivation if the topic involves focus or energy.
    - Background Sound Integration: Include subtle prompts that align with the background sound.
    - Conclusion (max 1 minute): Gently bring the meditation to a close, guiding the listener to refocus with mindful breaths.

    Important Details:
    - Keep language inclusive and positive, straightforward and soothing.
    - End with a brief encouragement related to the topic.
    - You can use (SSML, Speech Synthesis Markup Language) to control the speech synthesis.
      - The whole script should be surrounded by <speak> tags.
      - Use <prosody rate="slow"> for slow-paced sections.
      - Use many <break time="Xs" /> where X is the appropriate amount of time in seconds
    - Ensure the script is approximately ${duration} minutes long.
    - The output should only be what the listener hears, excluding any technical instructions.
  `;
  return prompt;
}
