<template>
  <div class="pagination w-full flex items-center justify-center">
    <ul class="flex items-center justify-center gap-2">
      <!-- Previous button -->
      <button
        @click="updatePage($props.page - 1)"
        :disabled="$props.page < 2"
        class="border-[1px] md:border-2 stroke-white disabled:stroke-black disabled:!bg-inherit disabled:hover:!bg-inherit disabled:*:stroke-black disabled:cursor-not-allowed disabled:border-neutral-200 disabled:opacity-80">
        <i-chevron-right-solid class="text-sm mt-1"></i-chevron-right-solid>
      </button>

      <!-- First page -->
      <button @click="updatePage(1)" v-if="$props.page > 3">
        <div>1</div>
      </button>

      <!-- Last page -->
      <span class="mx-2 text-neutral-400 cursor-default" v-if="$props.page > 3"
        >...</span
      >

      <!-- Display three numbers before the current page -->
      <div class="flex items-center justify-center gap-1.5">
        <button
          @click="updatePage(pageNumber)"
          v-for="pageNumber in beforeNumbers"
          :key="pageNumber">
          <div>{{ pageNumber }}</div>
        </button>
      </div>

      <!-- Display active/current page -->
      <button class="active text-primary/80 bg-light">
        {{ $props.page }}
      </button>

      <div class="flex flex-row-reverse items-center justify-center gap-1.5">
        <!-- Display three numbers after the current page -->
        <button
          @click="updatePage(pageNumber)"
          v-for="pageNumber in afterNumbers"
          :key="pageNumber">
          <div>{{ pageNumber }}</div>
        </button>
      </div>

      <!-- Last page -->
      <span
        class="mx-2 text-neutral-400 cursor-default"
        v-if="$props.page < lastPage - 2"
        >...</span
      >

      <button @click="updatePage(lastPage)" v-if="$props.page < lastPage - 2">
        <div>{{ lastPage }}</div>
      </button>

      <!-- Next button -->
      <button
        @click="updatePage($props.page + 1)"
        :disabled="$props.page > lastPage - 1"
        class="border-[1px] md:border-2 stroke-white disabled:stroke-black disabled:!bg-inherit disabled:hover:!bg-inherit disabled:*:stroke-black disabled:cursor-not-allowed disabled:border-neutral-200 disabled:opacity-80">
        <i-chevron-left-solid class="text-sm mt-1"></i-chevron-left-solid>
      </button>
    </ul>
  </div>
</template>

<script setup>
// emits
const emit = defineEmits(["update-page"]);

// props
const props = defineProps({
  totalRecord: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

// computed
const lastPage = computed(() => {
  return Math.ceil(props.totalRecord / props.pageSize);
});
const beforeNumbers = computed(() => {
  const start = Math.max(1, props.page - 1);
  return Array.from(
    { length: Math.min(props.page - 1, 1) },
    (_, index) => start + index
  );
});
const afterNumbers = computed(() => {
  const end = Math.min(lastPage.value, props.page + 1);
  return Array.from(
    { length: Math.min(lastPage.value - props.page, 1) },
    (_, index) => end - index
  );
});

// methods
const updatePage = (page) => {
  emit("update-page", page);
};
</script>

<style scoped>
.pagination button {
  @apply w-9 h-9 md:w-8 md:h-8 text-sm md:text-base text-neutral-400 hover:bg-neutral-400/10 font-bold flex items-center justify-center rounded-lg transition-all;
}
</style>
