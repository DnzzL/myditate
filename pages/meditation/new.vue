<template>
  <div class="grid place-items-center">
    <Card class="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center"
          >Customize Your Meditation</CardTitle
        >
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <Label for="topic">Meditation Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Focus, Sleep"
              v-model="topic"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="duration">Duration (minutes)</Label>
            <Slider
              id="duration"
              :min="5"
              :max="30"
              :step="1"
              v-model="duration"
            />
            <div class="text-center">{{ duration?.[0] }} minutes</div>
          </div>

          <div class="space-y-2">
            <Label for="voice">Voice</Label>
            <Select v-model="voice">
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in voiceOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="background-sound">Background Sound</Label>
            <Select v-model="backgroundSound">
              <SelectTrigger>
                <SelectValue placeholder="Select a background sound" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in backgroundSoundOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button class="w-full" type="submit"> Generate Meditation </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const voiceOptions = ["calm", "energetic", "soothing"];
const backgroundSoundOptions = ["none", "rain", "ocean", "forest"];

const topic = ref("");
const duration = ref([5]);
const voice = ref("calm");
const backgroundSound = ref("none");

async function handleSubmit() {
  // Here you would typically call an API to generate the meditation
  console.log("Generating meditation with:", {
    topic: topic.value,
    duration: duration.value,
    voice: voice.value,
    backgroundSound: backgroundSound.value,
  });
  // alert("Meditation generation started! Redirecting to loading screen...");
}
</script>
