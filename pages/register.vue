<template>
  <form
    @keydown.enter="userRegister"
    class="w-full flex flex-col items-center justify-center gap-4 sm:gap-8">
    <h1 class="sm:text-xl text-neutral-200">ایجاد حساب کاربری</h1>

    <div
      class="w-full flex flex-col items-center justify-start gap-1.5 sm:gap-3">
      <div class="w-full flex items-center justify-center gap-1.5 sm:gap-2">
        <!-- first name -->
        <input
          type="text"
          placeholder="نام"
          v-model="data.firstName"
          class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />

        <!-- lastname -->
        <input
          type="text"
          placeholder="نام خانوادگی"
          v-model="data.lastName"
          class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />
      </div>

      <!-- user name -->
      <input
        type="text"
        placeholder="نام کاربری"
        v-model="data.username"
        class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />

      <div class="w-full flex items-center justify-center gap-1.5 sm:gap-2">
        <!-- password -->
        <input
          type="password"
          placeholder="رمز عبور"
          v-model="data.password"
          class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />

        <!-- confirm password -->
        <input
          type="password"
          placeholder="تکرار رمز عبور"
          v-model="confirmPassword"
          class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />
      </div>

      <p
        class="w-full text-xs text-light transition-200"
        :class="[
          passwordIsConfirmed
            ? 'translate-x-2 opacity-0'
            : 'translate-x-0 opacity-100',
        ]">
        رمز عبور با تکرار آن مغایرت دارد!
      </p>
    </div>

    <div class="w-full -mt-5 flex flex-col items-center justify-center gap-4">
      <!-- button -->
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="!validData || loading"
        @click.prevent="userRegister"
        class="w-full h-9 sm:h-12 rounded-lg sm:rounded-xl">
        <span class="text-xs sm:text-base">ثبت نام</span>
      </v-btn>

      <!-- login -->
      <nuxt-link to="/login">
        <p class="text-xs sm:text-sm text-neutral-300">
          حساب کاربری دارید؟
          <span class="text-secondary underline">وارد شوید</span>
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
const confirmPassword = ref(null);
const data = ref({
  firstName: null,
  lastName: null,
  username: null,
  password: null,
  role: "Coach",
});

// computed
const validData = computed(() => {
  return (
    data.value.firstName &&
    data.value.lastName &&
    data.value.username &&
    data.value.password &&
    data.value.password == confirmPassword.value
  );
});
const passwordIsConfirmed = computed(() => {
  if (confirmPassword.value) {
    return data.value.password === confirmPassword.value;
  } else {
    return true;
  }
});
const userRegister = async () => {
  // check if resgiter api is already called, prevent from calling again
  if (loading.value) return;

  loading.value = true;

  await nuxtApp.$axios
    .post("/User/Register", {
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
