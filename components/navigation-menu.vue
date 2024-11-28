<template>
  <div v-if="shouldDisplay">
    <header
      class="items-center justify-between hidden w-full px-4 py-3 shadow-sm lg:flex bg-background text-foreground sm:px-6 md:px-8 lg:px-10"
    >
      <NuxtLink href="#" class="flex items-center">
        <Sprout class="w-6 h-6" />
        <span class="sr-only">Myditate</span>
      </NuxtLink>
      <nav class="items-center hidden gap-6 text-sm font-medium lg:flex">
        <NuxtLink
          v-for="shortcut in shortcuts"
          :key="shortcut.text"
          :href="shortcut.href"
          class="transition-colors hover:text-primary hover:underline hover:underline-offset-4"
        >
          {{ shortcut.text }}
        </NuxtLink>
      </nav>
    </header>
    <div
      class="fixed bottom-0 left-0 z-10 flex items-center justify-around w-full py-3 shadow-t lg:hidden bg-background"
    >
      <NuxtLink
        v-for="shortcut in shortcuts"
        :key="shortcut.text"
        :href="shortcut.href"
        class="flex flex-col items-center gap-1 text-xs font-medium transition-colors text-muted-foreground hover:text-primary"
      >
        <Component :is="shortcut.icon" class="w-6 h-6" />
        {{ shortcut.text }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, House, Sprout, UserRound } from "lucide-vue-next";
import { computed } from "vue";

const { t } = useI18n({
  useScope: "local",
});
const route = useRoute();

const shortcuts = [
  {
    icon: House,
    text: t("navigation.home"),
    href: "/",
  },
  {
    icon: CirclePlus,
    text: t("navigation.create"),
    href: "/meditation/new",
  },
  {
    icon: UserRound,
    text: t("navigation.settings"),
    href: "/settings",
  },
];

const shouldDisplay = computed(
  () => route.path !== "/login" && route.path !== "/signup"
);
</script>

<i18n lang="json">
{
  "en": {
    "navigation": {
      "home": "Home",
      "create": "Create",
      "settings": "Settings"
    }
  },
  "fr": {
    "navigation": {
      "home": "Accueil",
      "create": "Créer",
      "settings": "Paramètres"
    }
  }
}
</i18n>
