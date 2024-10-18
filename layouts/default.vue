<template>
  <div
    class="default-layout relative max-h-screen h-screen flex flex-col items-start justify-start gap-0 overflow-hidden">
    <app-header></app-header>

    <div class="relative w-full h-full flex items-start justify-start gap-0">
      <app-sidebar></app-sidebar>

      <main
        :class="[`${isOpen ? 'rounded-tr-3xl' : 'rounded-none'}`]"
        class="w-full h-full max-h-full gap-2 p-2 lg:p-6 bg-white lg:rounded-tr-3xl overflow-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
// variables
const isOpen = ref(false);
const nuxtApp = useNuxtApp();

// lifecycles
onMounted(() => {
  nuxtApp.$emitter.on("toggleSidebar", (e) => (isOpen.value = e));
});
</script>

<style scoped>
.default-layout {
  background-color: #080369;
  background-size: 60px;
  background-repeat: repeat;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='%23a4d8fc' fill-opacity='0.08'%3E%3Cpath fill-rule='evenodd' d='M5 3.59L1.46.05.05 1.46 3.59 5 .05 8.54l1.41 1.41L5 6.41l3.54 3.54 1.41-1.41L6.41 5l3.54-3.54L8.54.05 5 3.59zM17 2h24v2H17V2zm0 4h24v2H17V6zM2 17h2v24H2V17zm4 0h2v24H6V17z'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
