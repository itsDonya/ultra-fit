<template>
  <aside
    :class="[`${isOpen ? 'min-w-4/5 w-4/5 p-2' : ' min-w-0 w-0 max-w-0 p-0'}`]"
    class="absolute top-0 right-0 lg:static h-full lg:min-w-56 lg:w-56 lg:max-w-56 lg:p-2 transition-all duration-300 overflow-hidden z-10">
    <v-list v-model:opened="open">
      <template v-for="(item, i) in sidebarLinks">
        <v-list-group v-if="item.children" :value="item.value" class="p-0">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" class="p-0">
              <div class="w-full" :key="i" :to="item.path">
                <div
                  class="w-full h-11 xl:h-12 px-4 bg-none flex items-center justify-start gap-3 rounded-lg transition-all duration-200">
                  <component
                    :is="`i-${item.icon}`"
                    class="text-white"></component>
                  <span class="text-sm text-white">{{ item.title }}</span>
                </div>
              </div>
            </v-list-item>
          </template>

          <v-list-item v-for="(child, j) in item.children" :key="j">
            <nuxt-link class="w-full" :to="child.path">
              <div
                class="w-full h-11 xl:h-12 px-4 flex items-center justify-start gap-3 rounded-lg transition-all duration-200">
                <span class="text-sm text-white">{{ child.title }}</span>
              </div>
            </nuxt-link>
          </v-list-item>
        </v-list-group>

        <v-list-item v-else class="p-0">
          <nuxt-link class="w-full" :key="i" :to="item.path">
            <div
              class="w-full h-11 xl:h-12 px-4 bg-none flex items-center justify-start gap-3 rounded-lg transition-all duration-200">
              <component :is="`i-${item.icon}`" class="text-white"></component>
              <span class="text-sm text-white">{{ item.title }}</span>
            </div>
          </nuxt-link>
        </v-list-item>
      </template>
    </v-list>
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
    icon: "chart-line",
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
.v-list {
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
