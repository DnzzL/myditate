<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-purple-100"
  >
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-xl">
      <h1 class="text-2xl font-semibold text-center text-gray-800">
        {{ meditation.topic }}
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
          <span class="sr-only">Restart</span>
        </Button>
        <Button size="icon" @click="togglePlayPause">
          <component :is="isPlaying ? Pause : Play" class="w-4 h-4" />
          <span class="sr-only">{{ isPlaying ? "Pause" : "Play" }}</span>
        </Button>
        <div>
          <Select
            v-model="playbackSpeed"
            @update:model-value="changePlaybackSpeed"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select playback speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="'0.5'">0.5x</SelectItem>
              <SelectItem :value="'0.75'">0.75x</SelectItem>
              <SelectItem :value="'1'">1x</SelectItem>
              <SelectItem :value="'1.5'">1.5x</SelectItem>
              <SelectItem :value="'1.75'">1.75x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pause, Play, SkipBack } from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isPlaying = ref(false);
const currentTime = ref(0);
const playbackSpeed = ref("1");
const audioRef = ref<HTMLAudioElement>(null);

const id = route.params.id;

const { result } = await useLoader("meditation/playback", {
  params: { id },
});

const client = useSupabaseClient();

const { data: audioBlob } = await client.storage
  .from("meditations")
  .download(result.value?.meditation.audio_files?.url);

const meditation = computed(() => result.value?.meditation);
const durationInSeconds = computed(() => meditation.value?.duration * 60);

onMounted(() => {
  if (audioBlob) {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.value.src = audioUrl;
      audioRef.value.playbackRate = playbackSpeed.value;
      audioRef.value.addEventListener("timeupdate", updateTime);
      audioRef.value.load();
    } catch (error) {
      console.error("Failed to create object URL:", error);
    }
  } else {
    console.error("Invalid audioBlob or audioRef:", audioBlob, audioRef.value);
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
    audioRef.value.playbackRate = playbackSpeed.value;
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
