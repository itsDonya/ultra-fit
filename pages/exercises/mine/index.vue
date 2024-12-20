<template>
  <article
    class="custom-exercises w-full max-h-screen p-6 flex flex-col items-start justify-between gap-8 pb-24 overflow-auto">
    <div
      class="w-full p-1 lg:p-0 flex flex-col items-start justify-start gap-4">
      <div
        class="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
        <!-- title -->
        <h2 class="md:text-xl text-neutral-700 font-bold">لیست حرکات من</h2>

        <!-- filters -->
        <div
          class="w-full md:w-auto -mb-6s flex items-center justify-end gap-2">
          <!-- search -->
          <v-text-field
            clearable
            hide-details
            label="جستجو"
            color="secondary"
            variant="outlined"
            v-model="filters.search"></v-text-field>

          <!-- category -->
          <v-select
            clearable
            hide-details
            color="secondary"
            label="دسته بندی"
            variant="outlined"
            :items="categories"
            :loading="categoriesLoading"
            v-model="filters.categoryId"></v-select>

          <!-- type -->
          <v-select
            clearable
            hide-details
            label="نوع حرکت"
            color="secondary"
            variant="outlined"
            :items="typesList"
            :loading="categoriesLoading"
            v-model="filters.exerciseType"></v-select>
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
        class="w-full grid grid-cols-2 md:grid-cols-8 grid-rows-5 md:grid-rows-2 items-start justify-start gap-4">
        <li
          @click="router.push(`/exercises/mine/${item.id}`)"
          v-for="(item, i) in exerciseList"
          :key="i"
          class="w-full p-1.5 flex flex-col items-start justify-start gap-4 cursor-pointer">
          <img
            :src="$config.public.imageCdn + item.logo"
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
import { typesList } from "@/utils/types";

// variables
const router = useRouter();
const nuxtApp = useNuxtApp();

// loadings
const fetchLoading = ref(false);
const categoriesLoading = ref(false);

// data
const categories = ref([]);
const exerciseList = ref([]);
const filters = ref({
  search: null,
  categoryId: null,
  exerciseType: null,
});

// pagination
const pagination = ref({
  page: 1,
  pageSize: 24,
  totalRecord: 0,
});

// fetch
const getExercises = async () => {
  fetchLoading.value = true;

  await nuxtApp.$axios
    .post(`/Exercise/GetCoachExercise`, {
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
const getCategories = async () => {
  categoriesLoading.value = true;

  await nuxtApp.$axios
    .post(`/Category/GetAll`, {})
    .then((response) => {
      categories.value = response.data.result.records.map((item) => {
        return {
          ...item,
          value: item.id,
          title: item.name,
        };
      });
    })
    .catch((error) => error && console.log("categories error: ", error))
    .finally(() => {
      categoriesLoading.value = false;
    });
};

// methods
const updatePage = (pageNumber) => {
  pagination.value.page = pageNumber;
  getExercises();
};

// lifecycles
onMounted(() => {
  getCategories();
  getExercises();
});

// watchers
watch(
  () => filters.value,
  () => {
    updatePage(1);
    getExercises();
  },
  { deep: true }
);
</script>

<style>
.custom-exercises .v-input {
  @apply !min-w-0 !w-44;
}
.custom-exercises .v-input .v-field__outline .v-label {
  @apply !bg-transparent;
}
.custom-exercises .v-field__field {
  @apply !min-h-10 h-10 max-h-10;
}
.custom-exercises .v-field__input {
  @apply -mt-1.5 text-sm;
}
</style>
