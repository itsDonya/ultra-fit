<template>
  <aside
    :class="[`${isOpen ? 'min-w-4/5 w-4/5 p-2' : ' min-w-0 w-0 max-w-0 p-0'}`]"
    class="absolute top-0 right-0 lg:static h-full lg:min-w-56 lg:w-56 lg:max-w-56 lg:p-2 transition-all duration-300 overflow-hidden z-10"
  >
    <v-expansion-panels>
      <template v-for="(item, i) in sidebarLinks">
        <v-expansion-panel v-if="item.children" elevation="0">
          <v-expansion-panel-title class="p-0">
            <v-list-item class="p-0">
              <div :key="i" :to="item.path">
                <div
                  class="h-11 xl:h-12 px-4 bg-none flex items-center justify-start gap-3 rounded-lg transition-all duration-200"
                >
                  <component
                    :is="`i-${item.icon}`"
                    class="text-white"
                  ></component>
                  <span class="text-sm text-white">{{ item.title }}</span>
                </div>
              </div>
            </v-list-item>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              class="w-full"
            >
              <nuxt-link class="w-full" :to="child.path">
                <div
                  class="w-full h-11 xl:h-12 px-4 flex items-center justify-start gap-3 rounded-lg transition-all duration-200"
                >
                  <span class="text-sm text-white">{{ child.title }}</span>
                </div>
              </nuxt-link>
            </v-list-item>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-list-item v-else class="w-full p-0">
          <nuxt-link class="w-full" :key="i" :to="item.path">
            <div
              class="w-full h-11 xl:h-12 px-4 bg-none flex items-center justify-start gap-3 rounded-lg transition-all duration-200"
            >
              <component :is="`i-${item.icon}`" class="text-white"></component>
              <span class="text-sm text-white">{{ item.title }}</span>
            </div>
          </nuxt-link>
        </v-list-item>
      </template>
    </v-expansion-panels>
  </aside>
</template>

<script setup>
import { navigateTo } from "nuxt/app";

// variables
const open = ref([]);
const isOpen = ref(false);
const nuxtApp = useNuxtApp();
const sidebarLinks = ref([
  {
    value: "Dashboard",
    icon: "dashboard",
    title: "داشبورد",
    path: "/coming-soon",
  },
  {
    value: "Exercises",
    icon: "dumbbell",
    title: "حرکات",

    children: [
      {
        title: "حرکات عمومی",
        path: "/exercises",
      },
      {
        title: "حرکات من",
        path: "/exercises/mine",
      },
      {
        title: "ایجاد حرکت",
        path: "/exercises/mine/add",
      },
    ],
  },
  {
    value: "Workouts",
    icon: "calendar-lines",
    title: "برنامه ها",

    children: [
      {
        title: "برنامه‌های عمومی",
        path: "/workouts",
      },
      {
        title: "برنامه‌های من",
        path: "/workouts/mine",
      },
      {
        title: "ایجاد برنامه",
        path: "/workouts/mine/add",
      },
    ],
  },
  {
    value: "Athletes",
    icon: "people-group",
    title: "شاگرد ها",
    path: "/athletes",
  },
  {
    value: "Diet",
    icon: "salad",
    title: "رژیم ها",
    path: "/coming-soon",
  },
]);

// methods
const logout = () => {
  const TOKEN = useCookie("ULTRA_TK");
  TOKEN.value = null;

  const USERNAME = useCookie("ULTRA_USER");
  USERNAME.value = null;

  nuxtApp.$toast.success("با موفقیت از حساب کاربری خارج شدید");

  navigateTo("/login");
};

// lifecycles
onMounted(() => {
  nuxtApp.$emitter.on("toggleSidebar", (e) => (isOpen.value = e));
});
</script>

<style>
.mdi-chevron-down::before,
.mdi-chevron-up::before {
  color: white;
}
</style>

<style scoped>
.v-list,
.v-expansion-panel {
  background-color: transparent;
}
@media (max-width: 1024px) {
  aside {
    @apply bg-gradient-to-tl from-blue-900 via-primary to-blue-900;
  }
}
.router-link-exact-active div {
  @apply bg-white/15;
}
</style>
