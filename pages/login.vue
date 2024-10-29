<template>
  <form class="w-full flex flex-col items-center justify-center gap-4 sm:gap-8">
    <h1 class="sm:text-xl text-neutral-200">ورود به حساب کاربری</h1>

    <v-tabs fixed-tabs v-model="activeTab" color="light" class="w-full">
      <v-tab value="mobile">ورود با رمز عبور</v-tab>
      <v-tab value="otp">ورود با رمز یکبار مصرف</v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="w-full">
      <v-window-item value="mobile" class="w-full">
        <div
          class="w-full flex flex-col items-center justify-start gap-1.5 sm:gap-3">
          <!-- username -->
          <input
            type="text"
            maxlength="11"
            placeholder="شماره موبایل"
            v-model="data.username"
            class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />

          <!-- password -->
          <input
            type="password"
            placeholder="رمز عبور"
            v-model="data.password"
            class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />

          <!-- button -->
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!validData || loading"
            @click.prevent="userLogin"
            class="w-full h-9 sm:h-12 mt-4 rounded-lg sm:rounded-xl">
            <span class="text-xs sm:text-base">ورود</span>
          </v-btn>
        </div>
      </v-window-item>

      <v-window-item value="otp" class="w-full">
        <div
          class="w-full flex flex-col items-center justify-start gap-1.5 sm:gap-3">
          <v-window v-model="otpLevel" class="w-full">
            <!-- mobile -->
            <v-window-item value="mobile" class="w-full">
              <input
                type="text"
                maxlength="11"
                placeholder="شماره موبایل"
                v-model="data.username"
                class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />

              <!-- button -->
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="!data.username || data.username.length != 11"
                @click.prevent="sendOtp"
                class="w-full h-9 sm:h-12 mt-4 rounded-lg sm:rounded-xl">
                <span class="text-xs sm:text-base">ارسال کد یکبار مصرف</span>
              </v-btn>
            </v-window-item>

            <!-- code -->
            <v-window-item value="code" class="w-full">
              <input
                type="text"
                placeholder="کد پیامک شده"
                v-model="otpCode"
                class="w-full h-9 sm:h-12 p-2 sm:p-4 text-xs sm:text-base text-white bg-neutral-200/20 border border-white/20 placeholder:text-white/40 focus:border-secondary rounded-lg sm:rounded-xl-tw transition-all duration-200" />

              <!-- button -->
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="!otpCode || otpCode.length != 4"
                @click.prevent="verifyOtp"
                class="w-full h-9 sm:h-12 mt-4 rounded-lg sm:rounded-xl">
                <span class="text-xs sm:text-base">ورود به حساب</span>
              </v-btn>
            </v-window-item>
          </v-window>
        </div>
      </v-window-item>
    </v-window>

    <div class="w-full flex flex-col items-center justify-center gap-4">
      <!-- login -->
      <nuxt-link to="/register">
        <p class="text-xs sm:text-sm text-neutral-300">
          حساب کاربری ندارید؟
          <span class="text-secondary underline">ثبت نام کنید</span>
        </p>
      </nuxt-link>
    </div>
  </form>
</template>

<script setup>
import { navigateTo } from "nuxt/app";

definePageMeta({
  layout: "auth",
});

// variables
const userId = ref(null);
const otpCode = ref(null);
const loading = ref(false);
const activeTab = ref("mobile");
const otpLevel = ref("mobile");
const nuxtApp = useNuxtApp();
const data = ref({
  username: null,
  password: null,
});

// computed
const validData = computed(() => {
  return data.value.username && data.value.password;
});
const userLogin = async () => {
  // check if login api is already called, prevent from calling again
  if (loading.value) return;

  loading.value = true;

  await nuxtApp.$axios
    .post("/User/Login", {
      ...data.value,
    })
    .then((res) => {
      if (res.data.errorCode == "WrongPassword") {
        nuxtApp.$toast.error("گذرواژه صحیح نمی باشد");
        data.value.password = null;
      } else if (res.data.errorCode == "UserNotFound") {
        nuxtApp.$toast.error("کاربری با این مشخصات وجود ندارد");
        data.value.username = null;
        data.value.password = null;
      } else {
        const TOKEN = res.data.result.token;
        const USERNAME = res.data.result.username;

        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);

        const cookieTOKEN = useCookie("ULTRA_TK", {
          maxAge: 2592000,
          expires: nextMonth,
        });
        cookieTOKEN.value = TOKEN;

        const cookieUSERNAME = useCookie("ULTRA_USER", {
          maxAge: 2592000,
          expires: nextMonth,
        });
        cookieUSERNAME.value = USERNAME;

        nuxtApp.$toast.success("با موفقیت وارد شدید");

        navigateTo("/");
      }
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

const sendOtp = async () => {
  // check if login api is already called, prevent from calling again
  if (loading.value) return;

  loading.value = true;

  await nuxtApp.$axios
    .post("/User/LoginWithSMS", {
      username: data.value.username,
      role: "Coach",
    })
    .then((res) => {
      console.log("res: ", res.data.result);
      userId.value = res.data.result.userId;
      otpLevel.value = "code";
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

const verifyOtp = async () => {
  // check if login api is already called, prevent from calling again
  if (loading.value) return;

  loading.value = true;

  await nuxtApp.$axios
    .post("/User/GenerateUserToken", {
      userId: userId.value,
      otpCode: otpCode.value,
    })
    .then((res) => {
      if (res.data.errorCode == "WrongOtp") {
        nuxtApp.$toast.error("کد یکبار مصرف وارد شده صحیح نمی‌باشد");
        otpCode.value = null;
      } else {
        nuxtApp.$toast.success("با موفقیت وارد شدید");

        navigateTo("/");
      }
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

<style lang="scss">
.v-tabs {
  .v-btn {
    border-radius: 10px 10px 0 0 !important;
  }

  .v-btn:not(.v-tab--selected) {
    color: #a4d8fc80 !important;
  }
  .v-btn.v-tab--selected {
    background-color: #a4d8fc20;
  }
}
</style>
