<template>
  <div
    class="default-layout relative max-h-screen h-screen bg-gradient-to-tl from-blue-900 via-primary to-blue-800 flex flex-col items-start justify-start gap-0 overflow-hidden">
    <app-header></app-header>

    <div class="relative w-full h-full flex items-start justify-start gap-">
      <!-- <app-sidebar></app-sidebar> -->

      <main
        :class="[`${isOpen ? 'rounded-tr-3xl' : 'rounded-none'}`]"
        class="w-full min-h-full max-h-[94%] bg-white lg:rounded-tr-">
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
