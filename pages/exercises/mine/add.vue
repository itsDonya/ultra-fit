<template>
  <article class="w-full p-6 mx-auto bg-white rounded-xl-tw">
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
          <option
            v-for="item in typesList"
            :value="item.value"
            class="text-black">
            {{ item.title }}
          </option>
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
  </article>
</template>

<script setup>
import { navigateTo } from "nuxt/app";
import { typesList } from "@/utils/types";

// variables
const categories = ref([]);
const { $axios, $toast } = useNuxtApp();

// loadings
const addLoading = ref(false);

// data
const addExerciseData = ref({});

// images
const image1 = ref(null);
const image2 = ref(null);
const logo = ref(null);

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

// fetch
const getCategories = async () => {
  await $axios
    .post(`/Category/GetAll`)
    .then((response) => {
      categories.value = response.data.result.records;
    })
    .catch((error) => error && console.log("categories error: ", error));
};
const addExercise = async () => {
  if (!validAddExercise.value) return;

  addLoading.value = true;

  await $axios
    .post("/Exercise/CreateExercise", addExerciseData.value, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      $toast.success("حرکت با موفقیت ایجاد شد");
      resetExerciseData();
      navigateTo("/exercises/mine");
    })
    .catch((error) => error && console.log("add error: ", error))
    .finally(() => (addLoading.value = false));
};

// methods
const resetExerciseData = () => {
  // images
  resetImages();

  // add data
  addExerciseData.value = {};
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
      break;
    case 2:
      addExerciseData.value.image2 = FILE;
      image2.value = URL.createObjectURL(FILE);
      break;
    case 3:
      addExerciseData.value.logo = FILE;
      logo.value = URL.createObjectURL(FILE);
      break;
  }
};

// lifecycles
onMounted(() => {
  getCategories();
});
</script>
