<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-purple-100"
  >
    <Loader2 v-if="status === 'pending'" class="w-4 h-4 mr-2 animate-spin" />
    <div
      v-else
      class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-xl"
    >
      <h1 class="text-2xl font-semibold text-center text-gray-800">
        {{ meditation!.topic }}
      </h1>

      <div class="relative w-64 h-64 mx-auto">
        <div
          class="absolute inset-0 bg-blue-200 rounded-full"
          :class="{ 'animate-pulse-slow': isPlaying }"
        ></div>
        <div
          class="absolute flex items-center justify-center bg-white rounded-full inset-4"
        >
          <span class="text-4xl font-bold text-blue-500">{{
            formatTime(durationInSeconds - currentTime)
          }}</span>
        </div>
      </div>

      <audio ref="audioRef" />

      <Slider
        :model-value="[currentTime]"
        @update:model-value="handleSeek"
        :max="durationInSeconds"
        :step="1"
        class="w-full"
      />

      <div class="flex justify-between text-sm text-gray-500">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(durationInSeconds) }}</span>
      </div>

      <div class="flex items-center justify-center space-x-4">
        <Button variant="outline" size="icon" @click="restart">
          <SkipBack class="w-4 h-4" />
          <span class="sr-only">{{ t("playback.restart") }}</span>
        </Button>
        <Button size="icon" @click="togglePlayPause">
          <component :is="isPlaying ? Pause : Play" class="w-4 h-4" />
          <span class="sr-only">{{
            isPlaying ? t("playback.pause") : t("playback.play")
          }}</span>
        </Button>
        <div>
          <Select
            v-model="playbackSpeed"
            @update:model-value="changePlaybackSpeed"
          >
            <SelectTrigger>
              <SelectValue placeholder="{{ t('playback.selectSpeed') }}" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="rate in playbackRates"
                :key="rate"
                :value="rate"
                >{{ `${rate}${t("playback.speedSuffix")}` }}</SelectItem
              >
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { Loader2, Pause, Play, SkipBack } from "lucide-vue-next";
import { onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";

const { t } = useI18n({
  useScope: "local",
});
const route = useRoute();
const { toast } = useToast();

const playbackRates = ["0.5", "0.75", "1", "1.5", "1.75"];

const isPlaying = ref(false);
const currentTime = ref(0);
const playbackSpeed = ref("1");
const audioRef = ref<HTMLAudioElement | null>(null);

const {
  data: meditation,
  status,
  error,
} = useFetch(`/api/meditations/${route.params.id}/playback`, {});

if (error.value || !meditation) {
  toast({
    description: error.value?.message ?? "Failed to fetch meditation",
    variant: "destructive",
  });
}

const client = useSupabaseClient();

const durationInSeconds = computed(() => {
  return (meditation.value?.duration ?? 0) * 60;
});

// watch when meditation is loaded to download audio file
watchEffect(async () => {
  if (meditation.value && meditation.value.audio_files) {
    const { data: audioBlob, error: audioBlobError } = await client.storage
      .from("meditations")
      .download(meditation.value.audio_files.url);
    if (audioBlobError) {
      toast({
        description: "Failed to download audio file",
        variant: "destructive",
      });
    }

    if (audioBlob) {
      try {
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.value) {
          audioRef.value.src = audioUrl;
          audioRef.value.playbackRate = Number(playbackSpeed.value);
          audioRef.value.addEventListener("timeupdate", updateTime);
          audioRef.value.load();
        }
      } catch (error) {
        console.error("Failed to create object URL:", error);
      }
    } else {
      console.error(
        "Invalid audioBlob or audioRef:",
        audioBlob,
        audioRef.value
      );
    }
  }
});

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.removeEventListener("timeupdate", updateTime);
    URL.revokeObjectURL(audioRef.value.src);
  }
});

function updateTime() {
  if (audioRef.value) {
    currentTime.value = Math.floor(audioRef.value.currentTime);
  }
}

function changePlaybackSpeed() {
  if (audioRef.value) {
    audioRef.value.playbackRate = Number(playbackSpeed.value);
  }
}

function togglePlayPause() {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause();
    } else {
      audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
}

function handleSeek(value: Array<number>) {
  if (audioRef.value) {
    audioRef.value.currentTime = value[0];
    currentTime.value = value[0];
  }
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function restart() {
  if (audioRef.value) {
    audioRef.value.currentTime = 0;
    currentTime.value = 0;
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "playback": {
      "restart": "Restart",
      "pause": "Pause",
      "play": "Play",
      "selectSpeed": "Select playback speed",
      "speedSuffix": "x"
    }
  },
  "fr": {
    "playback": {
      "restart": "Redémarrer",
      "pause": "Pause",
      "play": "Lecture",
      "selectSpeed": "Sélectionner la vitesse de lecture",
      "speedSuffix": "x"
    }
  }
}
</i18n>
