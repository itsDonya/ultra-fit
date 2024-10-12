<template>
  <div
    @click="toggleSidebar"
    class="size-10 hover:bg-white/20 flex lg:hidden flex-center rounded-full cursor-pointer transition-200 group">
    <i-bars-solid
      class="lg:text-lg text-white group-hover:text-white transition-200"></i-bars-solid>
  </div>
</template>

<script setup>
// variables
const isOpen = ref(false);
const nuxtApp = useNuxtApp();

// methods
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
  nuxtApp.$emitter.emit("toggleSidebar", isOpen.value);
};
</script>
