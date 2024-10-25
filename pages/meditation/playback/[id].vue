<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-purple-100"
  >
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-xl">
      <h1 class="text-2xl font-semibold text-center text-gray-800">
        {{ meditationTitle }}
      </h1>

      <div class="relative w-64 h-64 mx-auto">
        <div
          class="absolute inset-0 bg-blue-200 rounded-full animate-pulse"
        ></div>
        <div
          class="absolute flex items-center justify-center bg-white rounded-full inset-4"
        >
          <span class="text-4xl font-bold text-blue-500">{{
            formatTime(meditationLength - currentTime)
          }}</span>
        </div>
      </div>

      <audio ref="audioRef" src="/placeholder.mp3" />

      <Slider
        :value="[currentTime]"
        :max="meditationLength"
        :step="1"
        @value-change="handleSeek"
        class="w-full"
      />

      <div class="flex justify-between text-sm text-gray-500">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(meditationLength) }}</span>
      </div>

      <div class="flex justify-center space-x-4">
        <Button variant="outline" size="icon" @click="restart">
          <SkipBack class="w-4 h-4" />
          <span class="sr-only">Restart</span>
        </Button>
        <Button size="icon" @click="togglePlayPause">
          <component :is="isPlaying ? Pause : Play" class="w-4 h-4" />
          <span class="sr-only">{{ isPlaying ? "Pause" : "Play" }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pause, Play, SkipBack } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";

const route = useRoute();

const isPlaying = ref(false);
const currentTime = ref(0);
const audioRef = ref(null);

const id = route.params.id;

const {
  data: meditation,
  status,
  error,
  refresh,
  clear,
} = await useFetch("/api/modules", { id });

const updateTime = () => {
  if (audioRef.value) {
    currentTime.value = Math.floor(audioRef.value.currentTime);
  }
};

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.addEventListener("timeupdate", updateTime);
  }
});

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.removeEventListener("timeupdate", updateTime);
  }
});

const togglePlayPause = () => {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause();
    } else {
      audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const handleSeek = (value) => {
  if (audioRef.value) {
    audioRef.value.currentTime = value[0];
    currentTime.value = value[0];
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const restart = () => {
  if (audioRef.value) {
    audioRef.value.currentTime = 0;
    currentTime.value = 0;
  }
};
</script>
