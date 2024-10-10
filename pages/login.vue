<template>
  <form
    @keydown.enter="loginUser"
    class="w-full flex flex-col items-center justify-center gap-7">
    <h1 class="text-xl text-neutral-200">ایجاد حساب کاربری</h1>

    <div class="w-full flex flex-col items-center justify-start gap-3">
      <!-- username -->
      <input
        type="text"
        placeholder="نام کاربری"
        v-model="data.username"
        class="w-full h-12 p-4 text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-xl-tw transition-all duration-200" />

      <!-- password -->
      <input
        type="text"
        placeholder="رمز عبور"
        v-model="data.password"
        class="w-full h-12 p-4 text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-xl-tw transition-all duration-200" />
    </div>

    <div class="w-full flex flex-col items-center justify-center gap-4">
      <!-- button -->
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="!validData || loading"
        @click.prevent="loginUser"
        class="w-full h-12">
        <span class="text-white">ورود</span>
      </v-btn>

      <!-- login -->
      <nuxt-link to="/register">
        <p class="text-sm text-neutral-300">
          حساب کاربری ندارید؟
          <span class="text-secondary underline">ثبت‌نام کنید</span>
        </p>
      </nuxt-link>
    </div>
  </form>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

// variables
const loading = ref(false);
const nuxtApp = useNuxtApp();
const data = ref({
  username: null,
  password: null,
});

// computed
const validData = computed(() => {
  return data.value.username && data.value.password;
});
const loginUser = async () => {
  // check if resgiter api is already called, prevent from calling again
  if (loading.value) return;

  loading.value = true;

  await nuxtApp.$axios
    .post("/User/Login", {
      ...data.value,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
