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
          <div class="w-full py-2 flex items-center justify-center">
            <!-- fields -->
            <div
              class="w-96 !min-w-96 flex flex-col items-start justify-center gap-5"
            >
              <!-- name -->
              <v-text-field
                hide-details
                class="w-full"
                color="primary"
                variant="outlined"
                label="عنوان برنامه"
                v-model="workoutData.name"
              >
              </v-text-field>

              <!-- sessions -->
              <v-text-field
                hide-details
                class="w-full"
                type="number"
                color="primary"
                variant="outlined"
                label="تعداد جلسات در هفته"
                v-model.number="workoutData.sessionsPerWeek"
              ></v-text-field>

              <!-- duration -->
              <v-text-field
                hide-details
                class="w-full"
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
                class="w-full h-48 max-h-48"
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
          </div>
        </template>

        <template v-slot:item.2>
          <v-alert
            type="info"
            variant="tonal"
            class="mb-2"
            text="برای رفتن به مرحله‌ی بعد، برای هر جلسه دسته بندی مورد نظر را انتخاب و روی دکمه‌ی ثبت کلیک کنید"
          ></v-alert>

          <div
            class="w-full py-2 flex flex-col items-start justify-start gap-4"
          >
            <v-card
              border
              rounded="lg"
              elevation="0"
              :disabled="
                disabledCards.includes(i) ||
                (!disabledCards.includes(i - 1) && i !== 1)
              "
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

        <template v-slot:item.3>
          <div
            class="w-full py-2 flex flex-col items-start justify-start gap-4"
          >
            <v-card
              border
              rounded="lg"
              elevation="0"
              :disabled="disabledCards.includes(i)"
              class="w-full flex flex-col items-start justify-start gap-2"
              v-for="i in sessionsWithWorkouts.length"
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
              <div class="w-full p-4 grid grid-cols-4 gap-2">
                <v-select
                  hide-details
                  color="secondary"
                  class="w-full"
                  variant="outlined"
                  label="حرکت"
                  :items="exercises"
                  v-model="sessionsWithWorkouts[i - 1].exerciseId"
                ></v-select>

                <v-text-field
                  type="number"
                  hide-details
                  color="secondary"
                  class="w-full"
                  variant="outlined"
                  label="ست"
                  v-model="sessionsWithWorkouts[i - 1].set"
                ></v-text-field>

                <v-text-field
                  type="number"
                  hide-details
                  color="secondary"
                  class="w-full"
                  variant="outlined"
                  label="تکرار"
                  v-model="sessionsWithWorkouts[i - 1].repeat"
                ></v-text-field>

                <v-text-field
                  type="number"
                  hide-details
                  color="secondary"
                  class="w-full"
                  variant="outlined"
                  label="استراحت"
                  v-model="sessionsWithWorkouts[i - 1].rest"
                ></v-text-field>

                <v-textarea
                  type="number"
                  hide-details
                  color="secondary"
                  class="min-w-full w-full h-44 col-span-4"
                  variant="outlined"
                  label="توضیحات"
                  v-model="sessionsWithWorkouts[i - 1].description"
                ></v-textarea>

                <v-btn
                  color="primary"
                  @click="addExercise(i)"
                  class="w-full h-12 -mt-14 rounded-lg col-span-4"
                  >افزودن</v-btn
                >

                <!-- <v-btn
                  color="primary"
                  @click="disableCard(i)"
                  class="w-20 h-12 text-base rounded-lg"
                  >ثبت</v-btn
                > -->
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
const exercises = ref([]);
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
const sessionsWithWorkouts = ref([]);

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

const getExercises = async () => {
  await $axios
    .post(`/Exercise/GetPublicExercise`)
    .then((response) => {
      exercises.value = response.data.result.records.map((item) => {
        return {
          ...item,
          title: item.name,
          value: item.id,
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

const addExercise = async (i) => {
  await $axios
    .post("/Coach/AddSessionExercise", sessionsWithWorkouts.value[i - 1])
    .then((response) => {
      $toast.success("حرکت با موفقیت افزوده شد");
      disableCardNoLimits(i);
    })
    .catch((error) => error && console.log("add error: ", error))
    .finally(() => (addLoading.value = false));
};

// methods
const disableCardNoLimits = (i) => {
  disabledCards.value.push(i);
};
const disableCard = async (i) => {
  // check if categories are empty
  const index = i - 1;
  if (!sessions.value[index].categorys.length) {
    $toast.error("لطفاً دسته بندی مورد نظر را انتخاب کنید");
  } else {
    // disabledCards.value.push(i);

    await $axios
      .post("/Coach/AddSession", sessions.value[index])
      .then((response) => {
        headerId.value = response.data.result;
        $toast.success("جلسه با موفقیت ایجاد شد");

        const newSessionId = response.data.result;
        sessionsWithWorkouts.value.push({
          sessionId: newSessionId,
          exerciseId: null,
          exercise: null,
          set: null,
          repeat: null,
          rest: null,
          description: null,
          exerciseId2: null,
          exercise2: null,
          set2: null,
          repeat2: null,
          rest2: null,
          description2: null,
          exerciseId3: null,
          exercise3: null,
          set3: null,
          repeat3: null,
          rest3: null,
          description3: null,
        });

        disabledCards.value.push(i);
      })
      .catch((error) => error && console.log("add session error: ", error));
  }
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
  getExercises();
  getCategories();
});

// watchers
watch(
  () => disabledCards.value,
  (value) => {
    if (value.length == sessions.value.length) {
      step.value = 3;
      disabledCards.value = [];
    }
  },
  { deep: true }
);
</script>

<style>
.v-input {
  @apply !min-w-96 !w-96 !max-w-96;
}
.v-field__input {
  @apply !min-h-12 h-12;
}
.v-field-label {
  @apply text-[10px] md:text-sm;
}
.v-select__selection {
  @apply -mt-1.5 text-xs md:text-sm;
}
</style>
