<template>
  <div
    class="w-full mx-auto bg-white rounded-xl-tw"
    @keydown.enter="addExercise">
    <div class="w-full h-full flex flex-col items-start justify-start gap-4">
      <p class="text-neutral-600 font-bold">افزودن حرکت جدید</p>

      <div class="w-full flex flex-col items-start justify-start gap-4">
        <div class="w-full flex items-center justify-center gap-4">
          <!-- image 1 -->
          <label
            :class="[
              image1
                ? ' shadow-lg'
                : 'border-2 border-primary/20 border-dashed',
            ]"
            class="w-full h-44 flex flex-center gap-2 rounded-lg overflow-hidden cursor-pointer">
            <img
              v-if="image1"
              :src="image1"
              class="w-full h-full object-cover"
              alt="" />

            <template v-else>
              <i-plus-solid class="text-sm text-primary/40"></i-plus-solid>
              <p class="text-primary/40">آپلود تصویر</p>
            </template>

            <input
              type="file"
              class="hidden"
              @input="uploadAddImage($event, 1)" />
          </label>

          <!-- image 2 -->
          <label
            :class="[
              image2
                ? ' shadow-lg'
                : 'border-2 border-primary/20 border-dashed',
            ]"
            class="w-full h-44 flex flex-center gap-2 rounded-lg overflow-hidden cursor-pointer">
            <img
              v-if="image2"
              :src="image2"
              class="w-full h-full object-cover"
              alt="" />

            <template v-else>
              <i-plus-solid class="text-sm text-primary/40"></i-plus-solid>
              <p class="text-primary/40">آپلود تصویر</p>
            </template>

            <input
              type="file"
              class="hidden"
              @input="uploadAddImage($event, 2)" />
          </label>

          <!-- video -->
          <label
            :class="[
              logo ? ' shadow-lg' : 'border-2 border-primary/20 border-dashed',
            ]"
            class="w-full h-44 flex flex-center gap-2 rounded-lg overflow-hidden cursor-pointer">
            <img
              v-if="logo"
              :src="logo"
              class="w-full h-full object-cover"
              alt="" />

            <template v-else>
              <i-plus-solid class="text-sm text-primary/40"></i-plus-solid>
              <p class="text-primary/40">آپلود لوگو</p>
            </template>

            <input
              type="file"
              class="hidden"
              @input="uploadAddImage($event, 3)" />
          </label>
        </div>

        <input
          type="text"
          placeholder="عنوان حرکت"
          v-model="addExerciseData.name"
          class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

        <input
          type="text"
          v-model="addExerciseData.engName"
          placeholder="عنوان حرکت (به انگلیسی)"
          class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

        <select
          v-model="addExerciseData.exerciseType"
          :class="[addExerciseData.exerciseType ? '' : 'text-neutral-400']"
          class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200">
          <option :value="undefined" disabled selected>نوع حرکت</option>
          <option value="IsDumbbellMovement" class="text-black">دمبل</option>
          <option value="IsbarbellMovement" class="text-black">هالتر</option>
          <option value="IsCable" class="text-black">سیم کش</option>
          <option value="IsMachine" class="text-black">دستگاه</option>
          <option value="None" class="text-black">هیچکدام</option>
        </select>

        <select
          v-model="addExerciseData.categoryId"
          :class="[addExerciseData.categoryId ? '' : 'text-neutral-400']"
          class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200">
          <option :value="undefined" disabled selected>دسته بندی</option>
          <option
            v-for="item in categories"
            :key="item.id"
            :value="item.id"
            class="text-black">
            {{ item.name }}
          </option>
        </select>

        <textarea
          type="text"
          v-model="addExerciseData.description"
          placeholder="توضیحات حرکت"
          class="w-full h-28 resize-none p-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200"></textarea>
      </div>
    </div>

    <div class="w-44 flex items-center justify-center gap-2">
      <v-btn
        color="primary"
        @click="addExercise"
        :loading="addLoading"
        :disabled="!validAddExercise"
        class="w-full !h-11 mt-4 rounded-lg"
        >ثبت</v-btn
      >

      <!-- <v-btn
        @click="resetExerciseData"
        variant="outlined"
        color="red"
        class="w-1/2 !h-11 rounded-lg">
        انصراف
      </v-btn> -->
    </div>
  </div>
</template>

<script setup>
import { navigateTo } from "nuxt/app";

// variables
const categories = ref([]);
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

// images
const image1 = ref(null);
const image2 = ref(null);
const logo = ref(null);

// pagination
const pagination = ref({
  page: 1,
  pageSize: 6,
  totalRecord: 0,
});

// computed
const validAddExercise = computed(() => {
  return (
    addExerciseData.value.image1 &&
    addExerciseData.value.image2 &&
    addExerciseData.value.logo &&
    addExerciseData.value.name &&
    addExerciseData.value.engName &&
    addExerciseData.value.exerciseType &&
    addExerciseData.value.categoryId &&
    addExerciseData.value.description
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
const getCategories = async () => {
  await nuxtApp.$axios
    .post(`/Category/GetAll`)
    .then((response) => {
      categories.value = response.data.result.records;
    })
    .catch((error) => error && console.log("categories error: ", error));
};
const getExercises = async () => {
  fetchLoading.value = true;

  await nuxtApp.$axios
    .post(`/Exercise/GetCoachExercise`, pagination.value)
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
  if (!validAddExercise.value) return;

  addLoading.value = true;

  await nuxtApp.$axios
    .post("/Exercise/CreateExercise", addExerciseData.value, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      nuxtApp.$toast.success("حرکت با موفقیت ایجاد شد");
      pagination.value.page = 1;
      resetExerciseData();
      getExercises();
      navigateTo("/exercises/mine");
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

  // images
  resetImages();

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
const resetImages = () => {
  image1.value = null;
};
const uploadAddImage = (event, which) => {
  const FILE = event.target.files[0];

  switch (which) {
    case 1:
      addExerciseData.value.image1 = FILE;
      image1.value = URL.createObjectURL(FILE);
      return;
    case 2:
      addExerciseData.value.image2 = FILE;
      image2.value = URL.createObjectURL(FILE);
      return;
    case 3:
      addExerciseData.value.logo = FILE;
      logo.value = URL.createObjectURL(FILE);
      return;
  }
};

// lifecycles
onMounted(() => {
  getCategories();
});
</script>
