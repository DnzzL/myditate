<template>
  <div
    class="flex flex-col items-center justify-center w-full min-h-screen p-4 space-y-4"
  >
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSignup">
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Input
                id="email"
                v-model="email"
                placeholder="Email"
                type="email"
                required
              />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Input
                id="password"
                v-model="password"
                placeholder="Password"
                type="password"
                required
              />
            </div>
          </div>
          <div v-if="errorMsg" class="mt-2 text-red-500">{{ errorMsg }}</div>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" :disabled="isLoading">Cancel</Button>
            <Button type="submit" :disabled="isLoading"
              ><Loader2
                v-if="isLoading"
                class="w-4 h-4 mr-2 animate-spin"
              />Sign Up</Button
            >
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex gap-1 text-gray-500">
        <span>Already an account ?</span
        ><Button variant="link" @click="router.push('/login')">Sign Up</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { ref } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";

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
