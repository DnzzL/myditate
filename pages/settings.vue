<template>
  <div class="p-4 mx-auto">
    <!-- Profile Section -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>{{ t("settings.profile") }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center space-x-4">
          <div
            class="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full"
          >
            <Icon name="ph:user" size="32" />
          </div>
          <div>
            <p class="font-medium">{{ user?.email }}</p>
            <p class="text-sm text-gray-600">Free Plan</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="mx-auto" variant="outline" @click="handleLogout">
          🔒 {{ t("settings.logout") }}
        </Button></CardFooter
      >
    </Card>

    <!-- Settings Section -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>{{ t("settings.appSettings") }}</CardTitle>
      </CardHeader>
      <CardContent>
        <AutoForm
          class="space-y-6"
          :schema="schema"
          @submit="settingsForm"
          :field-config="{
            default_language: {
              label: '🌐 ' + t('settings.language'),
            },
            default_voice: {
              label: '🎙️ ' + t('settings.voice'),
            },
            default_duration: {
              label: '⏳ ' + t('settings.duration'),
            },
          }"
        >
          <Button type="submit" variant="secondary">{{
            t("settings.submit")
          }}</Button></AutoForm
        >
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { z } from "zod";

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const { t } = useI18n({
  useScope: "local",
});
const { toast } = useToast();

const availableLanguages = [
  {
    code: "en-US",
    label: "English",
  },
  {
    code: "fr-FR",
    label: "Français",
  },
];

const preferences = ref({
  default_language: "Français",
  default_voice: "calm female",
  default_duration: 10,
});

const schema = z.object({
  default_language: z
    .enum(["English", "Français"])
    .optional()
    .default(preferences.value.default_language),
  default_voice: z
    .enum(["calm female", "uplifting male"])
    .optional()
    .default(preferences.value.default_voice),
  default_duration: z
    .number()
    .int()
    .min(5)
    .max(30)
    .optional()
    .default(preferences.value.default_duration),
});

// Load existing preferences
onMounted(async () => {
  const { data } = await useFetch("/api/users/defaults");
  if (data.value) {
    preferences.value = {
      ...preferences.value,
      ...data.value,
    };
  }
});

async function settingsForm(data: z.infer<typeof schema>) {
  try {
    await $fetch("/api/users/defaults", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: unknown) {
    toast({
      description:
        error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive",
    });
  }
}

const handleLogout = async () => {
  await client.auth.signOut();
  router.push("/login");
};
</script>

<i18n lang="json">
{
  "en": {
    "settings": {
      "profile": "Profile",
      "appSettings": "App Settings",
      "language": "Language",
      "voice": "Preferred Voice",
      "duration": "Default Duration",
      "logout": "Logout",
      "submit": "Submit"
    }
  },
  "fr": {
    "settings": {
      "profile": "Profil",
      "appSettings": "Paramètres",
      "language": "Langue",
      "voice": "Voix préférée",
      "duration": "Durée par défaut",
      "logout": "Déconnexion",
      "submit": "Soumettre"
    }
  }
}
</i18n>
