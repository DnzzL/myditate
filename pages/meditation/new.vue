<template>
  <div class="grid place-items-center">
    <Card class="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center"
          >Customize Your Meditation</CardTitle
        >
      </CardHeader>
      <CardContent>
        <form v-enhance="enhance" method="POST" class="space-y-6">
          <div class="space-y-2">
            <Label for="topic">Meditation Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Focus, Sleep"
              name="topic"
              v-model="topic"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="duration">Duration (minutes)</Label>
            <Slider
              id="duration"
              :min="2"
              :max="10"
              :step="1"
              name="duration"
              v-model="duration"
            />
            <div class="text-center">{{ duration?.[0] }} minutes</div>
          </div>

          <div class="space-y-2">
            <FormField v-slot="{ componentField }" name="voice">
              <FormItem>
                <FormLabel for="voice">Voice</FormLabel>
                <Select v-bind="componentField" name="voice" v-model="voice">
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
              </FormItem>
            </FormField>
          </div>

          <div class="space-y-2">
            <FormField v-slot="{ componentField }" name="backgroundSound">
              <FormItem>
                <FormLabel for="background-sound">Background Sound</FormLabel>
                <Select v-bind="componentField" v-model="backgroundSound">
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
              </FormItem>
            </FormField>
          </div>
          <Button class="w-full" type="submit" :disabled="loading">
            <span v-if="loading"
              ><Loader2 class="w-4 h-4 mr-2 animate-spin" /> Generating
              ...</span
            >
            <span v-else>Generate meditation</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const voiceOptions = ["calm", "energetic", "soothing"];
const backgroundSoundOptions = ["none", "rain", "ocean", "forest"];

type MeditationNewScreenProps = {
  topic: string;
  duration: number;
  voice: string;
  backgroundSound: string;
};

const route = useRoute();
const {
  topic: routeTopic,
  duration: routeDuration,
  voice: routeVoice,
  backgroundSound: routeBackgroundSound,
} = route.query as unknown as MeditationNewScreenProps;

const topic = ref(routeTopic ?? "");
const duration = ref(routeDuration ? [routeDuration] : [5]);
const voice = ref(routeVoice ?? "calm");
const backgroundSound = ref(routeBackgroundSound ?? "none");

const { enhance, data, loading } = await useFormAction();
</script>
