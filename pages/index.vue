<template>
  <div>
    <div class="container p-6 mx-auto">
      <h1 class="mb-8 text-3xl font-bold">Meditation Dashboard</h1>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card class="col-span-full">
          <CardHeader>
            <CardTitle>Create New Meditation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button class="w-full" @click="router.push('/meditation/new')">
              <Plus class="w-4 h-4 mr-2" />
              Generate New Meditation
            </Button>
          </CardContent>
        </Card>

        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Meditations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul v-for="meditation in recentMeditations" class="space-y-10">
              <li
                :key="meditation.id"
                class="flex items-center justify-between"
              >
                <div>
                  <h3 class="font-medium">{{ meditation.topic }}</h3>
                  <p class="text-sm text-muted-foreground">
                    {{ meditation.duration }} minutes
                  </p>
                </div>
                <NuxtLink :to="`meditation/playback/${meditation.id}`">
                  <Button variant="ghost" size="icon">
                    <Play class="w-4 h-4" />
                    <span class="sr-only">Play {{ meditation.topic }}</span>
                  </Button>
                </NuxtLink>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul v-for="(topic, index) in suggestedTopics" class="space-y-2">
              <li :key="index">
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
import { Play, Plus } from "lucide-vue-next";

const router = useRouter();

const { result, error } = await useLoader("meditation/recent");
if (error.value?.statusCode === 401) {
  router.push("/login");
}
const recentMeditations = computed(() => result.value?.meditations ?? []);

const suggestedTopics = [
  "Stress Relief",
  "Sleep",
  "Morning Boost",
  "Anxiety Management",
  "Gratitude",
];
</script>
