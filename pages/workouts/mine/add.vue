<template>
  <div
    class="w-full max-h-screen mx-auto !pb-20 p-6 flex flex-center rounded-xl-tw overflow-auto">
    <v-window v-model="step" class="m-auto">
      <v-window-item>
        <div
          class="w-[540px] !min-w-[540px] py-2 flex flex-col items-start justify-center gap-5">
          <!-- warning -->
          <v-alert
            type="info"
            class="mb-2"
            rounded="lg"
            variant="tonal"
            text="در صورت انتخاب نکردن شاگرد، این برنامه به‌صورت عمومی در دسترس قرار خواهد گرفت"></v-alert>

          <!-- athlete -->
          <v-select
            chips
            multiple
            clearable
            hide-details
            color="primary"
            :items="athletes"
            variant="outlined"
            label="انتخاب شاگرد"
            :loading="athletesLoading"
            v-model="workoutData.athleteIds"
            @click:clear="workoutData.athleteIds = []">
          </v-select>

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
            :error="sessionsError"
            :hide-details="!sessionsError"
            :error-messages="sessionsError"
            type="number"
            color="primary"
            variant="outlined"
            label="تعداد جلسات در هفته"
            v-model.number="workoutData.sessionsPerWeek"></v-text-field>

          <!-- duration -->
          <v-text-field
            type="number"
            color="primary"
            label="طول دوره"
            variant="outlined"
            :error="durationError"
            :hide-details="!durationError"
            :error-messages="durationError"
            v-model="workoutData.duration"></v-text-field>

          <!-- description -->
          <v-textarea
            rows="3"
            hide-details
            color="primary"
            label="توضیحات"
            variant="outlined"
            v-model="workoutData.description">
          </v-textarea>

          <v-btn
            color="primary"
            @click="addWorkout"
            :loading="addLoading"
            :disabled="!validWorkout"
            class="w-[540px] !h-11 rounded-lg"
            >ثبت</v-btn
          >
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
// variables
const step = ref(0);
const stopped = ref(false);
const { $toast, $axios } = useNuxtApp();

// loadings
const addLoading = ref(false);
const athletesLoading = ref(false);

// data
const athletes = ref([]);
const workoutData = ref({
  name: null,
  duration: null,
  athleteIds: [],
  description: null,
  sessionsPerWeek: null,
});

// errors
const sessionsError = ref(null);
const durationError = ref(null);

// validations
const validWorkout = computed(() => {
  return (
    workoutData.value.name &&
    workoutData.value.sessionsPerWeek &&
    workoutData.value.duration
  );
});
const checkSessions = () => {
  if (workoutData.value.sessionsPerWeek > 7) {
    stopped.value = true;
    sessionsError.value = "تعداد جلسات در هفته نمی‌تواند بیشتر از 7 باشد";
  } else if (workoutData.value.sessionsPerWeek < 1) {
    stopped.value = true;
    sessionsError.value = "تعداد جلسات در هفته نمی‌تواند کمتر از 1 باشد";
  } else {
    stopped.value = false;
    sessionsError.value = null;
  }
};
const checkDuration = () => {
  if (workoutData.value.duration > 30) {
    stopped.value = true;
    durationError.value = "طول دوره نمی‌تواند بیشتر از 30 روز باشد";
  } else if (workoutData.value.duration < 1) {
    stopped.value = true;
    durationError.value = "طول دوره نمی‌تواند کمتر از 1 روز باشد";
  } else {
    stopped.value = false;
    durationError.value = null;
  }
};

// methods
const addWorkout = async () => {
  checkSessions();
  checkDuration();

  if (stopped.value) {
    return;
  }

  alert("test: working");
};

// fetch
const getAthletes = async () => {
  athletesLoading.value = true;

  await $axios
    .get(`/Coach/GetMyAthlete`)
    .then((response) => {
      athletes.value = response.data.result.records.map((item) => {
        return {
          title: `${item.firstName} ${item.lastName}`,
          value: item.id,
        };
      });
    })
    .catch((error) => error && $toast.error(error.message))
    .finally(() => {
      athletesLoading.value = false;
    });
};

// lifecycles
onMounted(() => {
  getAthletes();
});
</script>

<style>
.v-input {
  @apply !min-w-full !w-full !text-4xl;
}
.v-field__input:not(textarea) {
  @apply !min-h-14 h-14;
}
</style>
