// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "@nuxtjs/i18n",
  ],
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/",
      exclude: ["/signup"],
    },
  },
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "fr",
  },
});
