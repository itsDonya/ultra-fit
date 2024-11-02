<template>
  <div
    class="default-layout relative max-h-screen h-screen bg-gradient-to-tl from-blue-900 via-primary to-blue-800 flex flex-col items-start justify-start gap-0 overflow-hidden">
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
