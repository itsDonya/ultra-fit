<template>
  <v-btn
    :to="loading ? '' : username ? '' : '/login'"
    color="#ffffff"
    variant="outlined"
    :class="[username ? '' : 'px-2.5 xl:px-4']"
    class="px-2.5 xl:px-4hover:bg-white/10 gap-1 xl:gap-2 rounded-md"
  >
    <i-spinner-solid
      v-if="loading"
      class="text-white animate-spin"
    ></i-spinner-solid>

    <span v-else-if="username" class="mr-2 text-xs xl:text-sm text-white">
      {{ username }}
    </span>

    <template v-else>
      <i-user-solid class="text-[11px] xl:text-xs text-white"></i-user-solid>
      <span class="mr-2 text-xs xl:text-sm text-white">ورود</span>
    </template>
  </v-btn>
</template>

<script setup>
// variables
const loading = ref(false);
const username = ref(null);

// methods
const detectUser = () => {
  const USERNAME = useCookie("ULTRA_USER");
  if (USERNAME) {
    username.value = USERNAME.value;
  }

  loading.value = false;
};

// lifecycles
loading.value = true;

onMounted(() => {
  detectUser();
});
</script>
