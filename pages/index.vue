<template>
  <div>
    <div class="container p-6 mx-auto">
      <h1 class="mb-8 text-3xl font-bold">{{ t("index.dashboard") }}</h1>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card class="col-span-full">
          <CardHeader>
            <CardTitle>{{ t("index.createNewMeditation") }}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button class="w-full" @click="router.push('/meditation/new')">
              <Plus class="w-4 h-4 mr-2" />
              {{ t("index.generateNewMeditation") }}
            </Button>
          </CardContent>
        </Card>

        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>{{ t("index.recentMeditations") }}</CardTitle>
          </CardHeader>
          <CardContent>
            <Loader2
              v-if="status === 'pending'"
              class="w-4 h-4 mr-2 animate-spin"
            />
            <ul
              v-else
              v-for="meditation in recentMeditations"
              :key="meditation.id"
              class="space-y-10"
            >
              <li class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium">{{ meditation.topic }}</h3>
                  <p class="text-sm text-muted-foreground">
                    {{ meditation.duration }} {{ t("index.minutes") }}
                  </p>
                </div>
                <NuxtLink :to="`meditation/playback/${meditation.id}`">
                  <Button variant="ghost" size="icon">
                    <Play class="w-4 h-4" />
                    <span class="sr-only">{{
                      `${t("index.playMeditation")} ${meditation.topic}`
                    }}</span>
                  </Button>
                </NuxtLink>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{{ t("index.suggestedTopics") }}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul
              v-for="(topic, index) in suggestedTopics"
              :key="index"
              class="space-y-2"
            >
              <li>
                <NuxtLink :to="{ name: 'meditation-new', query: { topic } }">
                  <Button variant="link" class="p-0 text-primary">
                    {{ topic }}
                  </Button>
                </NuxtLink>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    function (_to, _from) {
      const user = useSupabaseUser();

      if (!user.value) {
        return navigateTo("/login");
      }
    },
  ],
});

import { useToast } from "@/components/ui/toast/use-toast";
import { Loader2, Play, Plus } from "lucide-vue-next";

const { t } = useI18n({
  useScope: "local",
});
const router = useRouter();
const { toast } = useToast();

const suggestedTopics = [
  "Stress Relief",
  "Sleep",
  "Morning Boost",
  "Anxiety Management",
  "Gratitude",
];

const { data, status, error } = await useFetch("/api/meditations/recent");

const recentMeditations = computed(() => data.value || []);

if (error.value) {
  toast({
    description: error.value?.message || "An unexpected error occurred",
    variant: "destructive",
  });
}
</script>

<i18n lang="json">
{
  "en": {
    "index": {
      "dashboard": "Meditation Dashboard",
      "createNewMeditation": "Create New Meditation",
      "generateNewMeditation": "Generate New Meditation",
      "recentMeditations": "Recent Meditations",
      "minutes": "minutes",
      "playMeditation": "Play",
      "suggestedTopics": "Suggested Topics"
    }
  },
  "fr": {
    "index": {
      "dashboard": "Tableau de Bord de Méditation",
      "createNewMeditation": "Créer une Nouvelle Méditation",
      "generateNewMeditation": "Générer une Nouvelle Méditation",
      "recentMeditations": "Méditations Récentes",
      "minutes": "minutes",
      "playMeditation": "Lire",
      "suggestedTopics": "Sujets Suggérés"
    }
  }
}
</i18n>
