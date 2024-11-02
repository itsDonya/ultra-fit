<template>
  <article
    class="w-full md:h-full flex flex-col items-start justify-between gap-8 pb-24 md:pb-4">
    <div
      class="w-full p-4 lg:p-0 flex flex-col items-start justify-start gap-4">
      <div class="w-full flex items-center justify-between">
        <!-- title -->
        <h2 class="md:text-xl text-neutral-700 font-bold">لیست حرکات</h2>

        <!-- filters -->
        <div class="w-full flex items-center justify-end gap-4">
          <!-- search -->
          <div
            class="w-28 md:w-52 h-7 md:h-10 px-2.5 flex items-center justify-start gap-2 border rounded-lg">
            <i-magnifying-glass class="text-neutral-300"></i-magnifying-glass>

            <input
              type="text"
              v-model="filters.search"
              placeholder="جستجوی حرکت"
              class="w-full h-full text-[10px] md:text-sm text-neutral-700" />
          </div>
        </div>
      </div>

      <i-spinner-solid
        v-if="fetchLoading"
        class="mx-auto my-8 text-2xl text-primary animate-spin"></i-spinner-solid>

      <p
        v-else-if="exerciseList.length == 0"
        class="my-6 mx-auto text-neutral-600">
        در حال حاضر اطلاعاتی وجود ندارد
      </p>

      <ul
        v-if="!fetchLoading && exerciseList.length"
        class="w-full grid grid-cols-2 md:grid-cols-5 grid-rows-5 md:grid-rows-2 items-start justify-start gap-x-6 md:gap-x-2 lg:gap-x-6 xl:gap-x-14 gap-y-6 md:gap-y-2 lg:gap-y-4">
        <li
          @click="router.push(`/exercises/${item.id}`)"
          v-for="(item, i) in exerciseList"
          :key="i"
          class="w-full p-1.5 flex flex-col items-start justify-start gap-4 cursor-pointer">
          <img
            src="/img/image-placeholder.png"
            class="w-full aspect-square object-cover origin-center rounded-md"
            alt="" />

          <div class="w-full flex flex-col items-start gap-0.5">
            <p class="text-dark line-clamp-1">{{ item.name }}</p>
            <p class="text-xs text-primary/80 line-clamp-1">
              {{ item.engName }}
            </p>
          </div>
        </li>
      </ul>
    </div>

    <app-pagination
      v-bind="pagination"
      v-if="!fetchLoading && exerciseList.length"
      @update-page="updatePage($event)"></app-pagination>
  </article>
</template>

<script setup>
// variables
const router = useRouter();
const nuxtApp = useNuxtApp();

// loadings
const fetchLoading = ref(false);

// data
const exerciseList = ref([]);
const filters = ref({
  search: null,
});

// pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  totalRecord: 0,
});

// fetch
const getExercises = async () => {
  fetchLoading.value = true;

  await nuxtApp.$axios
    .post(`/Exercise/GetPublicExercise`, {
      ...pagination.value,
      ...filters.value,
    })
    .then((response) => {
      exerciseList.value = response.data.result.records;
      pagination.value.totalRecord = response.data.result.totalRecord;
    })
    .catch((error) => error && console.log("exercises error: ", error))
    .finally(() => {
      fetchLoading.value = false;
    });
};

// methods
const updatePage = (pageNumber) => {
  pagination.value.page = pageNumber;
  getExercises();
};

// lifecycles
onMounted(() => {
  getExercises();
});

// watchers
watch(
  () => filters.value,
  () => {
    getExercises();
  },
  { deep: true }
);
</script>
