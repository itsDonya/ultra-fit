<template>
  <div class="w-full mx-auto bg-white rounded-xl-tw">
    <div class="w-full h-full flex flex-col items-start justify-start gap-5">
      <p class="text-neutral-600 font-bold">افزودن برنامه‌ی جدید</p>

      <div class="w-full flex flex-col items-start justify-start gap-5">
        <!-- name -->
        <v-text-field
          hide-details
          color="primary"
          variant="outlined"
          label="عنوان برنامه"
          v-model="workoutData.name">
        </v-text-field>

        <!-- sessions -->
        <v-text-field
          hide-details
          type="number"
          color="primary"
          variant="outlined"
          label="تعداد جلسات در هفته"
          v-model="workoutData.sessionsPerWeek"></v-text-field>

        <!-- duration -->
        <v-text-field
          hide-details
          type="number"
          color="primary"
          label="مدت زمان"
          variant="outlined"
          v-model="workoutData.duration"></v-text-field>

        <!-- description -->
        <v-textarea
          hide-details
          color="primary"
          label="توضیحات"
          variant="outlined"
          class="h-48 max-h-48"
          v-model="workoutData.description">
        </v-textarea>
      </div>
    </div>

    <div class="w-44 flex items-center justify-center gap-2">
      <v-btn
        color="primary"
        @click="addWorkout"
        :loading="addLoading"
        :disabled="!validWorkout"
        class="w-full !h-11 -mt-10 rounded-lg"
        >ثبت</v-btn
      >

      <!-- <v-btn
          @click="resetWorkoutData"
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
import { typesList } from "@/utils/types";

// variables
const categories = ref([]);
const { $axios, $toast } = useNuxtApp();

// loadings
const addLoading = ref(false);

// data
const workoutData = ref({});

// images
const image1 = ref(null);
const image2 = ref(null);
const logo = ref(null);

// computed
const validWorkout = computed(() => {
  return (
    workoutData.value.name &&
    workoutData.value.sessionsPerWeek &&
    workoutData.value.duration &&
    workoutData.value.description
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
const addWorkout = async () => {
  if (!validWorkout.value) return;

  addLoading.value = true;

  await $axios
    .post("/Coach/CreateHeader", workoutData.value)
    .then(() => {
      $toast.success("برنامه با موفقیت ایجاد شد");
      resetWorkoutData();
      navigateTo("/workouts/mine");
    })
    .catch((error) => error && console.log("add error: ", error))
    .finally(() => (addLoading.value = false));
};

// methods
const resetWorkoutData = () => {
  // images
  resetImages();

  // add data
  workoutData.value = {};
};
const resetImages = () => {
  image1.value = null;
};
const uploadAddImage = (event, which) => {
  const FILE = event.target.files[0];

  switch (which) {
    case 1:
      workoutData.value.image1 = FILE;
      image1.value = URL.createObjectURL(FILE);
      break;
    case 2:
      workoutData.value.image2 = FILE;
      image2.value = URL.createObjectURL(FILE);
      break;
    case 3:
      workoutData.value.logo = FILE;
      logo.value = URL.createObjectURL(FILE);
      break;
  }
};

// lifecycles
onMounted(() => {
  getCategories();
});
</script>

<style>
.v-input {
  @apply w-96 max-w-96;
}
.v-field__input {
  @apply min-h-12 h-12;
}
.v-field-label {
  @apply text-[10px] md:text-sm;
}
.v-select__selection {
  @apply -mt-1.5 text-xs md:text-sm;
}
</style>
