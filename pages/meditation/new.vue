<template>
  <div class="grid place-items-center">
    <Card class="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">{{
          t("new.title")
        }}</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="space-y-2">
            <Label>{{ t("new.meditationTopic") }}</Label>
            <Input
              id="topic"
              :placeholder="t('new.topicPlaceholder')"
              name="topic"
              v-model="formData.topic"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="duration">{{ t("new.duration") }}</Label>
            <Slider
              id="duration"
              :min="2"
              :max="10"
              :step="1"
              name="duration"
              v-model="formData.duration"
            />
            <div class="text-center">
              {{ formData.duration?.[0] }} {{ t("new.minutes") }}
            </div>
          </div>

          <div class="space-y-2">
            <Label for="voice">{{ t("new.voice") }}</Label>
            <Select name="voice" v-model="formData.voice">
              <SelectTrigger>
                <SelectValue :placeholder="t('new.selectVoice')" />
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
            <Label for="background-sound">{{ t("new.backgroundSound") }}</Label>
            <Select v-model="formData.backgroundSound">
              <SelectTrigger>
                <SelectValue :placeholder="t('new.selectBackgroundSound')" />
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
          <Button
            class="flex flex-row w-full"
            type="submit"
            :disabled="isLoading"
          >
            <span v-if="isLoading">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />{{
                t("new.generating")
              }}
            </span>
            <span v-else>{{ t("new.generateMeditation") }}</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { Loader2 } from "lucide-vue-next";
import { ref } from "vue";

const voiceOptions = ["calm", "energetic", "soothing"];
const backgroundSoundOptions = ["none", "rain", "ocean", "forest"];

type MeditationNewScreenProps = {
  topic: string;
  duration: number;
  voice: string;
  backgroundSound: string;
};

const { t } = useI18n({
  useScope: "local",
});
const route = useRoute();
const {
  topic: routeTopic,
  duration: routeDuration,
  voice: routeVoice,
  backgroundSound: routeBackgroundSound,
} = route.query as unknown as MeditationNewScreenProps;
const { toast } = useToast();

const initialFormData = {
  topic: routeTopic ?? "",
  duration: routeDuration ? [routeDuration] : [5],
  voice: routeVoice ?? "calm",
  backgroundSound: routeBackgroundSound ?? "none",
};
const formData = ref(initialFormData);
const isLoading = ref(false);

async function onSubmit() {
  try {
    isLoading.value = true;
    const redirectUrl = await $fetch("/api/meditations/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData.value),
      immediate: false,
    });

    if (!redirectUrl) {
      toast({
        description: "Failed to generate meditation",
        variant: "destructive",
      });
    }

    formData.value = { ...initialFormData };
    navigateTo(redirectUrl);
  } catch {
    toast({
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  }
  isLoading.value = false;
}
</script>

<i18n lang="json">
{
  "en": {
    "new": {
      "title": "Customize Your Meditation",
      "meditationTopic": "Meditation Topic",
      "topicPlaceholder": "e.g., Focus, Sleep",
      "duration": "Duration (minutes)",
      "minutes": "minutes",
      "voice": "Voice",
      "selectVoice": "Select a voice",
      "backgroundSound": "Background Sound",
      "selectBackgroundSound": "Select a background sound",
      "generating": "Generating",
      "generateMeditation": "Generate meditation"
    }
  },
  "fr": {
    "new": {
      "title": "Personnalisez Votre Méditation",
      "meditationTopic": "Sujet de la Méditation",
      "topicPlaceholder": "par ex., Concentration, Sommeil",
      "duration": "Durée (minutes)",
      "minutes": "minutes",
      "voice": "Voix",
      "selectVoice": "Sélectionner une voix",
      "backgroundSound": "Son de Fond",
      "selectBackgroundSound": "Sélectionner un son de fond",
      "generating": "Génération",
      "generateMeditation": "Générer la méditation"
    }
  }
}
</i18n>
