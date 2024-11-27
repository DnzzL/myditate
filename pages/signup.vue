<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen p-4 space-y-4"
  >
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>{{ t("signup.title") }}</CardTitle>
        <CardDescription>{{ t("signup.description") }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSignup">
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Input
                id="email"
                v-model="email"
                :placeholder="t('signup.emailPlaceholder')"
                type="email"
                required
              />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Input
                id="password"
                v-model="password"
                :placeholder="t('signup.passwordPlaceholder')"
                type="password"
                required
              />
            </div>
          </div>
          <div v-if="errorMsg" class="mt-2 text-red-500">{{ errorMsg }}</div>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" :disabled="isLoading">{{
              t("signup.cancel")
            }}</Button>
            <Button type="submit" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />{{
                t("signup.signUp")
              }}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex gap-1 text-gray-500">
        <span>{{ t("signup.alreadyAccount") }}</span>
        <Button variant="link" @click="router.push('/login')">{{
          t("signup.login")
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

async function handleSignup() {
  try {
    errorMsg.value = "";
    isLoading.value = true;

    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    isLoading.value = false;
    if (error) throw error;

    toast({
      description:
        "Signup successful! Please check your email for verification.",
    });
    router.push("/login");
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
    "signup": {
      "title": "Sign Up",
      "description": "Create a new account",
      "emailPlaceholder": "Email",
      "passwordPlaceholder": "Password",
      "cancel": "Cancel",
      "signUp": "Sign Up",
      "alreadyAccount": "Already have an account?",
      "login": "Login"
    }
  },
  "fr": {
    "signup": {
      "title": "Inscription",
      "description": "Créer un nouveau compte",
      "emailPlaceholder": "Email",
      "passwordPlaceholder": "Mot de passe",
      "cancel": "Annuler",
      "signUp": "S'inscrire",
      "alreadyAccount": "Vous avez déjà un compte ?",
      "login": "Connexion"
    }
  }
}
</i18n>
