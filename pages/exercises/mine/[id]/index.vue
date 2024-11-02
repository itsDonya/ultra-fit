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

      <div class="w-full flex items-center justify-between">
        <div
          class="w-full flex flex-col md:flex-row items-start md:items-center justify-start gap-1.5 md:gap-8"
        >
          <!-- category -->
          <p class="text-xs md:text-sm 3xl:text-base text-dark/80">
            دسته بندی:
            <span class="font-bold"> ---- دسته بندی رو نمیفرستی ---- </span>
          </p>

          <!-- type -->
          <p class="text-xs md:text-sm 3xl:text-base text-dark">
            نوع حرکت:
            <span class="text-primary font-bold">
              {{ findType(exerciseData.exerciseType) }}
            </span>
          </p>
        </div>

        <!-- actions -->
        <div class="flex items-center justify-end gap-2">
          <!-- edit -->
          <v-btn
            @click="router.push(`/exercises/mine/${route.params.id}/edit`)"
            class="h-8 md:h-9"
            color="#eab308"
            variant="outlined"
            rounded="lg"
          >
            <span class="text-xs md:text-sm">ویرایش</span>
            <i-pen-solid class="mr-2 text-yellow-500"></i-pen-solid>
          </v-btn>

          <!-- delete -->
          <v-btn
            @click="openDeleteDialog"
            class="h-8 md:h-9"
            color="red"
            variant="outlined"
            rounded="lg"
          >
            <span class="text-xs md:text-sm">حذف</span>
            <i-trash-can-regular
              class="mr-2 text-red-500"
            ></i-trash-can-regular>
          </v-btn>
        </div>
      </div>

      <!-- images -->
      <div
        class="w-full mt-2 md:mt-6 flex flex-cols items-center justify-start gap-4 md:gap-8"
      >
        <!-- logo -->
        <client-only>
          <div v-viewer class="w-full">
            <img
              src="/img/image-placeholder.png"
              class="w-full h-32 md:h-56 object-cover rounded-lg cursor-pointer"
              :alt="exerciseData.name"
            />
          </div>
        </client-only>

        <!-- image 1 -->
        <client-only>
          <div v-viewer class="w-full">
            <img
              src="/img/image-placeholder.png"
              class="w-full h-32 md:h-56 object-cover rounded-lg cursor-pointer"
              :alt="exerciseData.name"
            />
          </div>
        </client-only>

        <!-- image 2 -->
        <client-only>
          <div v-viewer class="w-full">
            <img
              src="/img/image-placeholder.png"
              class="w-full h-32 md:h-56 object-cover rounded-lg cursor-pointer"
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

    <v-dialog v-model="deleteDialog">
      <div
        class="w-96 p-5 m-auto bg-white flex flex-col items-start justify-center gap-4 rounded-xl-tw shadow-lg"
      >
        <p class="text-dark">آیا از حذف این حرکت اطمینان دارید؟</p>

        <div class="w-full flex items-center justify-center gap-2">
          <v-btn
            :loading="deleteLoading"
            color="red"
            rounded="lg"
            variant="flat"
            class="w-1/2 h-10"
            @click="deleteExercise"
            >حذف</v-btn
          >
          <v-btn
            class="w-1/2 h-10"
            color="red"
            variant="outlined"
            rounded="lg"
            @click="deleteDialog = false"
            >انصراف</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </article>
</template>

<script setup>
import { findType } from "@/utils/types";

// variables
const route = useRoute();
const router = useRouter();
const { $axios, $toast } = useNuxtApp();

// dialogs
const deleteDialog = ref(false);

// loadings
const fetchLoading = ref(false);
const deleteLoading = ref(false);

// data
const exerciseData = ref({});

// fetch
const getExerciseData = async (id) => {
  fetchLoading.value = true;

  await $axios
    .get(`/Exercise/GetCoachExerciseById?id=${id}`)
    .then((response) => {
      console.log("data: ", response.data.result);
      exerciseData.value = response.data.result;

      const errorCode = response.data.errorCode;
      if (errorCode && errorCode == "ExerciseNotFound") {
        $toast.warning("موردی با این شناسه یافت نشد");
        router.push("/exercises/mine");
      }
    })
    .catch((error) => {
      error && console.log("exercises error: ", error);
    })
    .finally(() => {
      fetchLoading.value = false;
    });
};
const deleteExercise = async () => {
  console.log("id:::: ", Number(route.params.id));
  deleteLoading.value = true;

  await $axios
    .delete(`/Exercise/DeleteCoachExercise`, {
      id: Number(route.params.id),
    })
    .then((response) => {
      console.log("data: ", response.data.result);
      $toast.success("عملیات با موفقیت انجام شد");
      router.push("/exercises/mine");
    })
    .catch((error) => error && console.log("delete exercise error: ", error))
    .finally(() => {
      deleteLoading.value = false;
    });
};

// methods
const openDeleteDialog = () => {
  deleteDialog.value = true;
};

// lifecycles
onMounted(() => {
  const exerciseId = route.params.id;

  if (!exerciseId) {
    $toast.warning("ابتدا یک حرکت جهت مشاهده‌ی جزئیات انتخاب کنید");
    router.push("/exercises/mine");
  } else {
    getExerciseData(exerciseId);
  }
});
</script>
