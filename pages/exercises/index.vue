<template>
  <article
    class="w-full md:h-full flex flex-col items-start justify-between gap-8 pb-24 md:pb-4">
    <div
      class="w-full p-4 lg:p-0 flex flex-col items-start justify-start gap-4">
      <div class="w-full flex items-center justify-between">
        <!-- title -->
        <h2 class="md:text-xl text-neutral-700 font-bold">لیست حرکات</h2>
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
const addLoading = ref(false);

// dialogs
const addExerciseDialog = ref(false);
const viewExerciseDialog = ref(false);
const editExerciseDialog = ref(false);
const deleteExerciseDialog = ref(false);

// data
const exerciseList = ref([]);
const addExerciseData = ref({});
const viewExerciseData = ref({});
const editExerciseData = ref({});
const deleteExerciseData = ref({});

// pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  totalRecord: 0,
});

// computed
const validAddExercise = computed(() => {
  return (
    addExerciseData.value.firstName &&
    addExerciseData.value.lastName &&
    addExerciseData.value.userName
  );
});
const validEditExercise = computed(() => {
  return (
    editExerciseData.value.firstName &&
    editExerciseData.value.lastName &&
    editExerciseData.value.userName
  );
});

// fetch
const getExercises = async () => {
  fetchLoading.value = true;

  await nuxtApp.$axios
    .post(`/Exercise/GetPublicExercise`, pagination.value)
    .then((response) => {
      exerciseList.value = response.data.result.records;
      pagination.value.totalRecord = response.data.result.totalRecord;
    })
    .catch((error) => error && console.log("exercises error: ", error))
    .finally(() => {
      fetchLoading.value = false;
    });
};
const addExercise = async () => {
  addLoading.value = true;

  await nuxtApp.$axios
    .post("/Coach/AddExercise", addExerciseData.value)
    .then(() => {
      nuxtApp.$toast.success("عملیات با موفقیت انجام شد");
      pagination.value.page = 1;
      resetExerciseData();
      getExercises();
    })
    .catch((error) => error && console.log("add error: ", error))
    .finally(() => (addLoading.value = false));
};

// methods
const updatePage = (pageNumber) => {
  pagination.value.page = pageNumber;
  getExercises();
};
const resetExerciseData = () => {
  // dialogs
  closeDialogs();

  // add data
  addExerciseData.value = {};

  // view data
  viewExerciseData.value = {};

  // edit data
  editExerciseData.value = {};

  // delete data
  deleteExerciseData.value = {};
};
const closeDialogs = () => {
  addExerciseDialog.value = false;
  viewExerciseDialog.value = false;
  editExerciseDialog.value = false;
  deleteExerciseDialog.value = false;
};

// lifecycles
onMounted(() => {
  getExercises();
});
</script>
