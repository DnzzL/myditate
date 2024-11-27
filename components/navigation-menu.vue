<template>
  <div>
    <header
      class="items-center justify-between hidden w-full px-4 py-3 bg-white shadow-sm lg:flex dark:bg-gray-950 sm:px-6 md:px-8 lg:px-10"
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
          class="hover:underline hover:underline-offset-4"
        >
          {{ shortcut.text }}
        </NuxtLink>
      </nav>
    </header>
    <div
      class="fixed bottom-0 left-0 z-10 flex items-center justify-around w-full py-3 bg-white shadow-t dark:bg-gray-950 lg:hidden"
    >
      <NuxtLink
        v-for="shortcut in shortcuts"
        :key="shortcut.text"
        :href="shortcut.href"
        class="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <Component :is="shortcut.icon" class="w-6 h-6" />
        {{ shortcut.text }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, House, Sprout, UserRound } from "lucide-vue-next";

const { t } = useI18n({
  useScope: "local",
});

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
