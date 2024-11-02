<template>
  <div class="w-full h-full mx-auto pb-16 rounded-xl-tw">
    <div class="w-full h-full flex flex-col items-start justify-start gap-5">
      <p class="text-neutral-600 font-bold">افزودن برنامه‌ی جدید</p>

      <!-- stepper -->
      <v-stepper
        flat
        border
        hide-actions
        v-model="step"
        class="w-full h-full overflow-auto"
        :items="['ایجاد برنامه', 'افزودن جلسات', 'افزودن حرکات']"
      >
        <template v-slot:item.1>
          <div
            class="w-full py-2 flex flex-col items-start justify-start gap-5"
          >
            <!-- name -->
            <v-text-field
              hide-details
              color="primary"
              variant="outlined"
              label="عنوان برنامه"
              v-model="workoutData.name"
            >
            </v-text-field>

            <!-- sessions -->
            <v-text-field
              hide-details
              type="number"
              color="primary"
              variant="outlined"
              label="تعداد جلسات در هفته"
              v-model.number="workoutData.sessionsPerWeek"
            ></v-text-field>

            <!-- duration -->
            <v-text-field
              hide-details
              type="number"
              color="primary"
              label="مدت زمان"
              variant="outlined"
              v-model="workoutData.duration"
            ></v-text-field>

            <!-- description -->
            <v-textarea
              hide-details
              color="primary"
              label="توضیحات"
              variant="outlined"
              class="h-48 max-h-48"
              v-model="workoutData.description"
            >
            </v-textarea>

            <v-btn
              color="primary"
              @click="addWorkout"
              :loading="addLoading"
              :disabled="!validWorkout"
              class="w-96 !h-11 -mt-16 rounded-lg"
              >ثبت</v-btn
            >
          </div>
        </template>

        <template v-slot:item.2>
          <v-alert
            text="برای رفتن به مرحله‌ی بعد، برای هر جلسه دسته بندی مورد نظر را انتخاب و روی دکمه‌ی ثبت کلیک کنید"
            type="info"
            variant="tonal"
          ></v-alert>

          <div
            class="w-full py-2 flex flex-col items-start justify-start gap-4"
          >
            <v-card
              border
              rounded="lg"
              elevation="0"
              :disabled="disabledCards.includes(i)"
              class="w-full flex flex-col items-start justify-start gap-2"
              v-for="i in sessionsCount"
            >
              <!-- header -->
              <div
                class="w-full h-14 px-4 bg-black/5 flex items-center justify-start"
              >
                <p class="text-lg text-dark">
                  جلسه‌ی {{ persianCount[i - 1] }}
                </p>
              </div>

              <!-- category -->
              <div class="w-full p-4 flex items-center justify-start gap-2">
                <v-select
                  multiple
                  hide-details
                  color="secondary"
                  variant="outlined"
                  label="دسته بندی"
                  :items="categories"
                  v-model="sessions[i - 1].categorys"
                ></v-select>

                <v-btn
                  color="primary"
                  @click="disableCard(i)"
                  class="w-20 h-12 text-base rounded-lg"
                  >ثبت</v-btn
                >
              </div>
            </v-card>
          </div>
        </template>
      </v-stepper>
    </div>
  </div>
</template>

<script setup>
import { navigateTo } from "nuxt/app";
import { typesList } from "@/utils/types";

// variables
const step = ref(1);
const categories = ref([]);
const sessionsCount = ref(0);
const disabledCards = ref([]);
const { $axios, $toast } = useNuxtApp();
const persianCount = ref(["اول", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم"]);

// loadings
const addLoading = ref(false);

// data
const sessions = ref([]);
const headerId = ref(null);
const workoutData = ref({});

// images
const logo = ref(null);
const image1 = ref(null);
const image2 = ref(null);

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
      categories.value = response.data.result.records.map((item) => {
        return {
          ...item,
          title: item.name,
          value: item.name,
        };
      });
    })
    .catch((error) => error && console.log("categories error: ", error));
};

const addWorkout = async () => {
  if (!validWorkout.value) return;

  addLoading.value = true;

  await $axios
    .post("/Coach/CreateHeader", workoutData.value)
    .then((response) => {
      headerId.value = response.data.result;
      $toast.success("برنامه با موفقیت ایجاد شد");
      step.value = 2;
      sessionsCount.value = workoutData.value.sessionsPerWeek;
      for (let index = 0; index < workoutData.value.sessionsPerWeek; index++) {
        sessions.value.push({
          headerId: headerId.value,
          categorys: [],
        });
      }
    })
    .catch((error) => error && console.log("add error: ", error))
    .finally(() => (addLoading.value = false));
};

// methods
const disableCard = (i) => {
  const index = i;
  disabledCards.value.push(index);
};
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

// watchers
watch(
  () => sessions.value,
  (value) => {
    console.log("session changed: ", value);
  },
  { deep: true }
);
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
