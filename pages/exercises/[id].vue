<template>
  <article class="w-full flex flex-col items-start justify-start gap-8">
    <div
      class="w-full p-4 lg:p-0 flex flex-col items-start justify-start gap-4"
    >
      <div class="w-full flex items-center justify-between">
        <!-- title -->
        <h2
          class="md:text-xl text-neutral-700 flex items-center justify-start gap-2"
        >
          <span class="font-bold">{{ exerciseData.name }}</span>
          <span class="font-normal text-primary/80">
            - {{ exerciseData.engName }}</span
          >
        </h2>

        <!-- backward -->
        <v-btn
          @click="router.go(-1)"
          class="h-8 md:h-9"
          color="primary"
          variant="outlined"
          rounded="lg"
        >
          <span class="text-xs md:text-sm">بازگشت</span>
          <i-arrow-left
            class="mr-2 mt-0.5 text-[10px] md:text-xs text-primary"
          ></i-arrow-left>
        </v-btn>
      </div>

      <div
        class="w-full flex flex-col md:flex-row items-start md:items-center justify-start gap-1.5 md:gap-8"
      >
        <!-- category -->
        <p class="text-xs md:text-sm 3xl:text-base text-dark/80">
          دسته بندی:
          <span class="font-bold">{{ exerciseData.category?.name }}</span>
        </p>

        <!-- type -->
        <p class="text-xs md:text-sm 3xl:text-base text-dark">
          نوع حرکت:
          <span class="text-primary font-bold">
            {{ findType(exerciseData.exerciseType) }}
          </span>
        </p>
      </div>

      <!-- images -->
      <div
        class="w-full mt-2 md:mt-6 flex flex-cols items-center justify-start gap-4 md:gap-8"
      >
        <!-- image 1 -->
        <client-only>
          <div v-viewer>
            <img
              :src="$config.public.imageCdn + exerciseData.image1"
              class="h-32 md:h-72 object-covers object-contain rounded-lg cursor-pointer"
              :alt="exerciseData.name"
            />
          </div>
        </client-only>

        <!-- image 2 -->
        <client-only>
          <div v-viewer>
            <img
              :src="$config.public.imageCdn + exerciseData.image2"
              class="h-32 md:h-72 object-covers object-contain rounded-lg cursor-pointer"
              :alt="exerciseData.name"
            />
          </div>
        </client-only>
      </div>

      <!-- description -->
      <p
        class="mt-2 md:mt-4 pb-20 text-sm md:text-base text-dark whitespace-pre-line"
      >
        {{ exerciseData.description }}
      </p>
    </div>
  </article>
</template>

<script setup>
import { findType } from "@/utils/types";

// variables
const route = useRoute();
const router = useRouter();
const { $axios, $toast } = useNuxtApp();

// loadings
const fetchLoading = ref(false);

// data
const exerciseData = ref({});

// fetch
const getExerciseData = async (id) => {
  fetchLoading.value = true;

  await $axios
    .get(`/Exercise/GetPublicExerciseById?id=${id}`)
    .then((response) => {
      console.log("data: ", response.data.result);
      exerciseData.value = response.data.result;
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
const resetExerciseData = () => {
  // dialogs
  closeDialogs();

  // add data
  addExerciseData.value = {};

  // view data
  exerciseData.value = {};

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
  const exerciseId = route.params.id;

  if (!exerciseId) {
    $toast.error("ابتدا یک حرکت جهت مشاهده‌ی جزئیات انتخاب کنید");
    router.push("/exercises");
  } else {
    getExerciseData(exerciseId);
  }
});
</script>
