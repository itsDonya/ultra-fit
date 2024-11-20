<template>
  <div
    class="default-layout relative max-h-screen h-screen bg-gradient-to-tl from-[#320865] via-[#150924] to-[#320865] sto-[#5b67f0] flex flex-col items-start justify-start gap-0 overflow-hidden"
  >
    <app-header></app-header>

    <div class="relative w-full h-full flex items-start justify-start gap-">
      <app-sidebar></app-sidebar>

      <main
        :class="[`${isOpen ? 'rounded-tr-3xl' : 'rounded-none'}`]"
        class="w-full min-h-full max-h-[94%] bg-[#f8fafd] lg:rounded-tr-xl"
      >
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
