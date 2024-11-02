<template>
  <article class="w-full flex flex-col items-start justify-start gap-8">
    <div class="w-full flex flex-col items-start justify-start gap-4">
      <div class="w-full flex items-center justify-between">
        <!-- title -->
        <h2
          class="md:text-xl text-neutral-700 flex items-center justify-start gap-2">
          <span class="font-bold">{{ exerciseData.name }}</span>
          <span class="font-normal text-primary/80">
            - {{ exerciseData.engName }}</span
          >
        </h2>

        <!-- backward -->
        <v-btn
          @click="router.push('/exercises')"
          color="primary"
          variant="outlined"
          rounded="lg">
          <span>بازگشت</span>
          <i-arrow-left class="mr-2 mt-0.5 text-xs text-primary"></i-arrow-left>
        </v-btn>
      </div>

      <div class="w-full flex items-center justify-start gap-8">
        <!-- category -->
        <p class="text-sm 3xl:text-base text-dark/80">
          دسته بندی:
          <span class="font-bold"> ---- دسته بندی رو نمیفرستی ---- </span>
        </p>

        <!-- type -->
        <p class="text-sm 3xl:text-base text-dark">
          نوع حرکت:
          <span class="text-primary font-bold">
            {{ findType(exerciseData.exerciseType) }}
          </span>
        </p>
      </div>

      <!-- images -->
      <div class="w-full mt-6 flex items-center justify-start gap-8">
        <!-- logo -->
        <client-only>
          <div v-viewer class="w-full">
            <img
              src="/img/image-placeholder.png"
              class="w-full h-56 object-cover rounded-lg cursor-pointer"
              :alt="exerciseData.name" />
          </div>
        </client-only>

        <!-- image 1 -->
        <client-only>
          <div v-viewer class="w-full">
            <img
              src="/img/image-placeholder.png"
              class="w-full h-56 object-cover rounded-lg cursor-pointer"
              :alt="exerciseData.name" />
          </div>
        </client-only>

        <!-- image 2 -->
        <client-only>
          <div v-viewer class="w-full">
            <img
              src="/img/image-placeholder.png"
              class="w-full h-56 object-cover rounded-lg cursor-pointer"
              :alt="exerciseData.name" />
          </div>
        </client-only>
      </div>

      <!-- description -->
      <p class="mt-4 pb-20 text-dark whitespace-pre-line">
        {{ exerciseData.description }}
      </p>

      <!-- details -->
      <!-- <ul class="w-full flex flex-col items-start justify-start gap-2"> -->
      <!-- date -->
      <!-- <li class="flex items-center justify-start gap-2">
            <p class="text-xs 3xl:text-sm text-dark">
              تاریخ ایجاد:
              <span class="text-primary font-bold">{{
                exerciseData.creatDateShamsi
                  ? exerciseData.creatDateShamsi.split(" ")[0]
                  : ""
              }}</span>
            </p>
          </li> -->

      <!-- description -->
      <!-- <li class="flex items-center justify-start gap-2">
            <p class="text-xs 3xl:text-sm text-dark leading-5">
              توضیحات:
              <span class="font-bold">{{ exerciseData.description }}</span>
            </p>
          </li>
        </ul> -->

      <!-- <i-spinner-solid
          v-if="fetchLoading"
          class="mx-auto my-8 text-2xl text-primary animate-spin"></i-spinner-solid> -->

      <!-- <p
          v-else-if="exerciseList.length == 0"
          class="my-6 mx-auto text-neutral-600">
          در حال حاضر اطلاعاتی وجود ندارد
        </p>
  
        <ul
          v-if="!fetchLoading && exerciseList.length"
          class="w-full grid grid-cols-5 grid-rows-2 items-start justify-start gap-x-14 gap-y-4">
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
        </ul> -->
    </div>
  </article>
</template>

<script setup>
import { findType } from "../../utils/types";

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
