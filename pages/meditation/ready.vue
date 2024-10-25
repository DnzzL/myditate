<template>
  <div class="grid place-items-center">
    <Card class="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">{{
          topic
        }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="text-lg font-semibold text-center">
          Duration: {{ formatDuration(duration) }}
        </div>
        <div class="flex justify-center">
          <NuxtLink
            :to="{ name: 'meditation-playback-id', params: { id: 123 } }"
          >
            <Button size="lg" class="w-24 h-24 rounded-full">
              <PlayIcon class="w-12 h-12" />
            </Button>
          </NuxtLink>
        </div>
        <audio ref="audioRef" :src="audioUrl" />
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline" @click="downloadAudio">
          <DownloadIcon class="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" @click="emit('regenerate')">
          <RefreshCwIcon class="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Download as DownloadIcon,
  Play as PlayIcon,
  RefreshCw as RefreshCwIcon,
} from "lucide-vue-next";

type MeditationReadyScreenProps = {
  topic: string;
  duration: number;
  voice: string;
  backgroundSound: string;
  audioUrl: string;
};

const route = useRoute();
const { topic, duration, voice, backgroundSound, audioUrl } =
  route.query as any as MeditationReadyScreenProps;

const meditation = {
  topic,
  duration,
  voice,
  backgroundSound,
  audioUrl,
};

onMounted(() => {
  // save the meditation in database
  console.log("saving meditation", meditation);
  //   db.collection("meditations").add(meditation);
});

const emit = defineEmits<{
  (event: "regenerate"): void;
}>();

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const downloadAudio = () => {
  window.open(audioUrl, "_blank");
};
</script>
