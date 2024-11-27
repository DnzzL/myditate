<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen p-4 space-y-4"
  >
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>{{ t("login.title") }}</CardTitle>
        <CardDescription>{{ t("login.description") }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Input
                id="email"
                v-model="email"
                :placeholder="t('login.emailPlaceholder')"
                type="email"
                required
              />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Input
                id="password"
                v-model="password"
                :placeholder="t('login.passwordPlaceholder')"
                type="password"
                required
              />
            </div>
          </div>
          <div v-if="errorMsg" class="mt-2 text-red-500">{{ errorMsg }}</div>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" :disabled="isLoading">{{
              t("login.cancel")
            }}</Button>
            <Button type="submit" :disabled="isLoading"
              ><Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />{{
                t("login.login")
              }}</Button
            >
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex gap-1 text-gray-500">
        <span>{{ t("login.notSignedUp") }}</span
        ><Button variant="link" @click="router.push('/signup')">{{
          t("login.signUp")
        }}</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { Loader2 } from "lucide-vue-next";
import { ref } from "vue";

const { t } = useI18n({
  useScope: "local",
});
const router = useRouter();
const supabase = useSupabaseClient();
const { toast } = useToast();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const isLoading = ref(false);

async function handleLogin() {
  try {
    errorMsg.value = "";
    isLoading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    isLoading.value = false;

    if (error) throw error;

    router.push("/");
  } catch (error: unknown) {
    isLoading.value = false;
    if (error instanceof Error) {
      errorMsg.value = error.message;
    } else {
      errorMsg.value = "An unexpected error occurred";
    }
    toast({
      description: errorMsg.value,
      variant: "destructive",
    });
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "login": {
      "title": "Login",
      "description": "Enter your credentials to access your account",
      "emailPlaceholder": "Email",
      "passwordPlaceholder": "Password",
      "cancel": "Cancel",
      "login": "Login",
      "notSignedUp": "Not signed up yet?",
      "signUp": "Sign Up"
    }
  },
  "fr": {
    "login": {
      "title": "Connexion",
      "description": "Entrez vos identifiants pour accéder à votre compte",
      "emailPlaceholder": "Email",
      "passwordPlaceholder": "Mot de passe",
      "cancel": "Annuler",
      "login": "Se Connecter",
      "notSignedUp": "Pas encore inscrit ?",
      "signUp": "S'inscrire"
    }
  }
}
</i18n>
