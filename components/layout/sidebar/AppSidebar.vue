<template>
  <aside
    :class="[`${isOpen ? 'min-w-52 w-52 p-2' : ' min-w-0 w-0 max-w-0 p-0'}`]"
    class="h-full lg:min-w-52 lg:w-52 lg:max-w-52 lg:p-2">
    <nav class="w-full flex flex-col items-start justify-start gap-1">
      <nuxt-link
        class="w-full"
        :key="i"
        v-for="(item, i) in sidebarLinks"
        :to="item.path">
        <div
          class="w-full h-11 xl:h-12 px-4 bg-none flex items-center justify-start gap-3 hover:bg-white/20 rounded-lg transition-all duration-200">
          <component :is="`i-${item.icon}`" class="text-white"></component>
          <span class="text-sm xl:text-base text-white">{{ item.title }}</span>
        </div>
      </nuxt-link>
    </nav>
  </aside>
</template>

<script setup>
// variables
const isOpen = ref(true);
const sidebarLinks = ref([
  {
    icon: "chart-line",
    title: "داشبورد",
    // path: "/dashboard",
    path: "/coming-soon",
  },
  {
    icon: "dumbbell",
    title: "حرکات",
    // path: "/movements",
    path: "/coming-soon",
  },
  {
    icon: "calendar-lines",
    title: "برنامه ها",
    // path: "/programs",
    path: "/coming-soon",
  },
  {
    icon: "people-group",
    title: "شاگرد ها",
    path: "/pupils",
  },
  {
    icon: "salad",
    title: "رژیم ها",
    // path: "/diets",
    path: "/coming-soon",
  },
]);
</script>

<style scoped>
.router-link-exact-active div {
  @apply bg-white/30;
}
</style>
