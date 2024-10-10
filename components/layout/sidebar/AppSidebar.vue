<template>
  <aside class="min-w-52 w-52 h-full p-2">
    <nav class="w-full flex flex-col items-start justify-start gap-1">
      <nuxt-link
        class="w-full"
        :key="i"
        v-for="(item, i) in sidebarLinks"
        :to="item.path">
        <div
          class="w-full h-12 px-4 bg-none flex items-center justify-start gap-3 hover:bg-white/20 rounded-lg transition-all duration-200">
          <component :is="`i-${item.icon}`" class="text-white"></component>
          <span class="text-white">{{ item.title }}</span>
        </div>
      </nuxt-link>
    </nav>
  </aside>
</template>

<script setup>
// variables
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
