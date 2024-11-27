<template>
  <div class="grid place-items-center">
    <Card class="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">{{
          t("ready.title")
        }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="text-lg font-semibold text-center">
          {{ t("ready.duration") }}: {{ duration }} {{ t("ready.minutes") }}
        </div>
        <div class="flex justify-center">
          <NuxtLink :to="{ name: 'meditation-playback-id', params: { id } }">
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
          {{ t("ready.download") }}
        </Button>
        <Button variant="outline" @click="emit('regenerate')">
          <RefreshCwIcon class="w-4 h-4 mr-2" />
          {{ t("ready.regenerate") }}
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
  id: string;
  topic: string;
  duration: number;
  voice: string;
  backgroundSound: string;
  audioUrl: string;
};

const { t } = useI18n({
  useScope: "local",
});
const route = useRoute();
const { id, topic, duration, audioUrl } =
  route.query as unknown as MeditationReadyScreenProps;

const emit = defineEmits<{
  (event: "regenerate"): void;
}>();

const downloadAudio = () => {
  window.open(audioUrl, "_blank");
};
</script>

<i18n lang="json">
{
  "en": {
    "ready": {
      "title": "Meditation Ready",
      "duration": "Duration",
      "minutes": "minutes",
      "download": "Download",
      "regenerate": "Regenerate"
    }
  },
  "fr": {
    "ready": {
      "title": "Méditation Prête",
      "duration": "Durée",
      "minutes": "minutes",
      "download": "Télécharger",
      "regenerate": "Régénérer"
    }
  }
}
</i18n>
