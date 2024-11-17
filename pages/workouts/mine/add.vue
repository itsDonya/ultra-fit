<template>
  <div
    class="w-full max-h-screen mx-auto !pb-20 p-6 flex flex-center rounded-xl-tw overflow-auto"
  >
    <v-window v-model="step" class="m-auto">
      <v-window-item>
        <div
          class="w-[540px] !min-w-[540px] py-2 flex flex-col items-start justify-center gap-4"
        >
          <!-- warning -->
          <v-alert
            type="info"
            class="mb-2"
            rounded="lg"
            variant="tonal"
            text="در صورت انتخاب نکردن شاگرد، این برنامه به‌صورت عمومی در دسترس قرار خواهد گرفت"
          ></v-alert>

          <!-- athlete -->
          <v-select
            chips
            clearable
            hide-details
            color="primary"
            :items="athletes"
            variant="outlined"
            label="انتخاب شاگرد"
            :loading="athletesLoading"
            v-model="workoutData.athleteId"
            @click:clear="workoutData.athleteId = null"
          >
          </v-select>

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
            :error="!!sessionsError"
            :hide-details="!sessionsError"
            :error-messages="sessionsError"
            type="number"
            color="primary"
            variant="outlined"
            label="تعداد جلسات در هفته"
            v-model.number="workoutData.sessionsPerWeek"
          ></v-text-field>

          <!-- duration -->
          <v-text-field
            type="number"
            color="primary"
            label="طول دوره"
            variant="outlined"
            :error="!!durationError"
            :hide-details="!durationError"
            :error-messages="durationError"
            v-model="workoutData.duration"
          ></v-text-field>

          <!-- description -->
          <v-textarea
            rows="4"
            hide-details
            color="primary"
            label="توضیحات"
            variant="outlined"
            v-model="workoutData.description"
          >
          </v-textarea>

          <v-btn
            color="primary"
            @click="addWorkout"
            :loading="addLoading"
            :disabled="!validWorkout || addLoading"
            class="w-[540px] !h-11 rounded-lg"
            >ثبت</v-btn
          >
        </div>
      </v-window-item>

      <v-window-item>
        <div
          class="w-[600px] !min-w-[680px] py-2 flex flex-col items-start justify-center gap-4"
        >
          <v-expansion-panels
            v-model="panels"
            rounded="lg"
            elevation="1"
            bg-color="#eeeeee60"
          >
            <v-expansion-panel v-for="(session, i) in sessionsCount">
              <!-- title -->
              <v-expansion-panel-title>{{
                persianSessions[i]
              }}</v-expansion-panel-title>

              <!-- body -->
              <v-expansion-panel-text>
                <div
                  class="w-full flex flex-col items-center justify-start gap-2"
                >
                  <!-- category -->
                  <div
                    class="category-input w-full py-4 flex items-center justify-start gap-2"
                  >
                    <v-select
                      multiple
                      clearable
                      hide-details
                      label="دسته بندی"
                      color="secondary"
                      variant="outlined"
                      :items="categories"
                      :disabled="
                        addSessionLoading ||
                        !!sessions[i].exerciseData.sessionId
                      "
                      v-model="sessions[i].categoryData.categorys"
                    ></v-select>

                    <div>
                      <v-btn
                        color="primary"
                        variant="outlined"
                        @click="addSession(i)"
                        class="min-w-8 size-10 text-base rounded-lg"
                        :disabled="
                          addSessionLoading ||
                          sessions[i].exerciseData.sessionId
                        "
                      >
                        <i-check-solid class="text-primary tex"></i-check-solid>
                      </v-btn>
                    </div>
                  </div>

                  <template v-if="sessions[i].exerciseData.sessionId">
                    <span
                      class="w-full h-[1px] bg-neutral-300/80 rounded-[50%]"
                    ></span>

                    <!-- submitted -->
                    <div
                      v-if="sessions[i].exerciseData.submitted"
                      class="w-full h-12 pr-4 pl-1.5 mt-2 bg-white flex items-center justify-between border-r-4 border-secondary rounded-lg shadow"
                    >
                      <p class="text-dark font-bold">
                        {{ sessions[i].exerciseData.exerciseId }}
                        <span class="mr-2 text-sm text-neutral-400 font-normal"
                          >{{ sessions[i].exerciseData.set }} ست
                          {{ sessions[i].exerciseData.repeat }} تایی</span
                        >
                      </p>

                      <v-btn
                        variant="text"
                        color="red"
                        rounded="md"
                        :loading="removeExerciseLoading"
                        @click="removeExercise(i)"
                        >حذف</v-btn
                      >
                    </div>

                    <!-- submitted -->
                    <span
                      v-if="sessions[i].superData.submitted"
                      class="w-full h-[1px] mt-4 bg-neutral-300/80 rounded-[50%]"
                    ></span>

                    <div
                      v-if="sessions[i].superData.submitted"
                      class="w-full h-12 pr-4 mt-2 bg-white flex items-center justify-between border-r-4 border-teal-500 rounded-lg shadow overflow-hidden"
                    >
                      <p class="text-dark font-bold">
                        {{ sessions[i].superData.exerciseId }}
                        <span class="mr-2 text-sm text-neutral-400 font-normal">
                          {{ sessions[i].superData.set }} ست
                          {{ sessions[i].superData.repeat }} تایی
                        </span>
                      </p>

                      <div
                        class="h-full aspect-square bg-orange-500/10 flex-center"
                      >
                        <span class="mb-1 text-orange-500">سوپر</span>
                      </div>
                    </div>

                    <v-row
                      v-if="!sessions[i].exerciseData.submitted"
                      dense
                      class="exercise-input w-full py-4"
                    >
                      <!-- title -->
                      <v-col cols="12" class="mb-2">
                        <h2 class="text-dark font-bold">افزودن حرکت</h2>
                      </v-col>

                      <!-- exercise -->
                      <v-col cols="6">
                        <v-text-field
                          label="حرکت"
                          hide-details
                          color="secondary"
                          class="mb-1"
                          variant="outlined"
                          :disabled="
                            addExerciseLoading ||
                            !sessions[i].exerciseData.sessionId
                          "
                          v-model="sessions[i].exerciseData.exerciseId"
                        ></v-text-field>
                      </v-col>

                      <!-- set -->
                      <v-col cols="6">
                        <v-text-field
                          label="ست"
                          hide-details
                          type="number"
                          color="secondary"
                          class="mb-1"
                          variant="outlined"
                          :disabled="
                            addExerciseLoading ||
                            !sessions[i].exerciseData.sessionId
                          "
                          v-model.number="sessions[i].exerciseData.set"
                        ></v-text-field>
                      </v-col>

                      <!-- repeat -->
                      <v-col cols="6">
                        <v-text-field
                          label="تکرار"
                          hide-details
                          color="secondary"
                          class="mb-1"
                          variant="outlined"
                          :disabled="
                            addExerciseLoading ||
                            !sessions[i].exerciseData.sessionId
                          "
                          v-model="sessions[i].exerciseData.repeat"
                        ></v-text-field>
                      </v-col>

                      <!-- rest -->
                      <v-col cols="6">
                        <v-text-field
                          label="استراحت"
                          hide-details
                          type="number"
                          color="secondary"
                          class="mb-1"
                          variant="outlined"
                          :disabled="
                            addExerciseLoading ||
                            !sessions[i].exerciseData.sessionId
                          "
                          v-model.number="sessions[i].exerciseData.rest"
                        ></v-text-field>
                      </v-col>

                      <!-- description -->
                      <v-col cols="12">
                        <v-textarea
                          rows="4"
                          no-resize
                          hide-details
                          label="توضیحات"
                          color="secondary"
                          class="*:min-h-28 mb-1"
                          variant="outlined"
                          :disabled="
                            addExerciseLoading ||
                            !sessions[i].exerciseData.sessionId
                          "
                          v-model="sessions[i].exerciseData.description"
                        ></v-textarea>
                      </v-col>

                      <v-col
                        cols="12"
                        v-if="!sessions[i].exerciseData.submitted"
                      >
                        <v-btn
                          block
                          class="h-10"
                          rounded="lg"
                          variant="outlined"
                          color="teal"
                          :disabled="
                            addExerciseLoading ||
                            !sessions[i].exerciseData.sessionId
                          "
                          @click="addExercise(i)"
                          >ثبت حرکت</v-btn
                        >
                      </v-col>
                    </v-row>

                    <div class="w-full flex items-center justify-between">
                      <v-btn
                        variant="text"
                        color="primary"
                        rounded="md"
                        class="mt-2 place-self-start"
                        v-if="
                          sessions[i].exerciseData.submitted &&
                          !sessions[i].superData.active
                        "
                        @click="
                          sessions[i].superData.submitted
                            ? (sessions[i].superData2.active = true)
                            : (sessions[i].superData.active = true)
                        "
                      >
                        <i-plus-solid class="ml-2 text-primary"></i-plus-solid>
                        <span>افزودن حرکت سوپر</span>
                      </v-btn>

                      <v-btn
                        variant="text"
                        color="red"
                        rounded="md"
                        @click="removeSuper(i)"
                        :loading="removeSuperLoading"
                        v-if="sessions[i].superData.submitted"
                        >حذف حرکات سوپر</v-btn
                      >
                    </div>
                  </template>

                  <!-- ---- super ---- -->
                  <template
                    v-if="
                      sessions[i].exerciseData.submitted &&
                      sessions[i].superData.active
                    "
                  >
                    <span
                      class="w-full h-[1px] mt-4 bg-neutral-300/80 rounded-[50%]"
                    ></span>

                    <v-row dense class="exercise-input w-full py-4">
                      <!-- title -->
                      <v-col cols="12" class="mb-2">
                        <h2 class="text-dark font-bold">افزودن حرکت سوپر</h2>
                      </v-col>

                      <!-- exercise -->
                      <v-col cols="6">
                        <v-text-field
                          label="حرکت"
                          hide-details
                          color="secondary"
                          class="mb-1"
                          variant="outlined"
                          :disabled="addSuperLoading"
                          v-model="sessions[i].superData.exerciseId"
                        ></v-text-field>
                      </v-col>

                      <!-- set -->
                      <v-col cols="6">
                        <v-text-field
                          label="ست"
                          hide-details
                          type="number"
                          color="secondary"
                          class="mb-1"
                          variant="outlined"
                          :disabled="addSuperLoading"
                          v-model.number="sessions[i].superData.set"
                        ></v-text-field>
                      </v-col>

                      <!-- repeat -->
                      <v-col cols="6">
                        <v-text-field
                          label="تکرار"
                          hide-details
                          color="secondary"
                          class="mb-1"
                          variant="outlined"
                          :disabled="addSuperLoading"
                          v-model="sessions[i].superData.repeat"
                        ></v-text-field>
                      </v-col>

                      <!-- rest -->
                      <v-col cols="6">
                        <v-text-field
                          label="استراحت"
                          hide-details
                          type="number"
                          color="secondary"
                          class="mb-1"
                          variant="outlined"
                          :disabled="addSuperLoading"
                          v-model.number="sessions[i].superData.rest"
                        ></v-text-field>
                      </v-col>

                      <!-- description -->
                      <v-col cols="12">
                        <v-textarea
                          rows="4"
                          no-resize
                          hide-details
                          label="توضیحات"
                          color="secondary"
                          class="*:min-h-28 mb-1"
                          variant="outlined"
                          :disabled="addSuperLoading"
                          v-model="sessions[i].superData.description"
                        ></v-textarea>
                      </v-col>

                      <v-col cols="12" v-if="sessions[i].superData.active">
                        <v-btn
                          block
                          class="h-10"
                          rounded="lg"
                          variant="outlined"
                          color="teal"
                          :disabled="addSuperLoading"
                          @click="addSuperExercise(i)"
                          >ثبت حرکت سوپر</v-btn
                        >
                      </v-col>
                    </v-row>
                  </template>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-btn
            block
            color="primary"
            @click="addWorkout"
            :loading="addLoading"
            :disabled="!validWorkout || addLoading"
            class="!h-11 rounded-lg"
            >ثبت و ایجاد برنامه</v-btn
          >
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
// variables
const step = ref(0);
const panels = ref([0]);
const stopped = ref(false);
const { $toast, $axios } = useNuxtApp();

// loadings
const addLoading = ref(false);
const athletesLoading = ref(false);
const categoriesLoading = ref(false);
const addSessionLoading = ref(false);
const addExerciseLoading = ref(false);
const removeExerciseLoading = ref(false);
const addSuperLoading = ref(false);
const removeSuperLoading = ref(false);

// data
const athletes = ref([]);
const sessions = ref([]);
const workoutId = ref(null);
const sessionsCount = ref(0);
const categories = ref([]);
const workoutData = ref({
  name: null,
  duration: null,
  athleteId: null,
  description: null,
  sessionsPerWeek: null,
});

// errors
const sessionsError = ref(null);
const durationError = ref(null);

// static
const persianSessions = ref([
  "جلسه اول",
  "جلسه دوم",
  "جلسه سوم",
  "جلسه چهارم",
  "جلسه پنجم",
  "جلسه ششم",
  "جلسه هفتم",
]);

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
  addLoading.vlue = true;

  checkSessions();
  checkDuration();

  if (stopped.value) {
    addLoading.vlue = false;
    return;
  }

  addLoading.vlue = true;

  await $axios
    .post("/Coach/CreateHeader", workoutData.value)
    .then((response) => {
      step.value = 1;
      workoutId.value = response.data.result;
      addLoading.vlue = false;

      sessionsCount.value = workoutData.value.sessionsPerWeek;
      for (let index = 0; index < workoutData.value.sessionsPerWeek; index++) {
        sessions.value.push({
          categoryData: {
            headerId: workoutId.value,
            categorys: [],
          },
          exerciseData: {
            sessionId: null,
            exerciseId: null,
            exercise: null,
            set: null,
            repeat: null,
            rest: null,
            description: null,
            submitted: false,
          },
          superData: {
            exerciseId: null,
            exercise: null,
            set: null,
            repeat: null,
            rest: null,
            description: null,
            submitted: false,
          },
          superData2: {
            exerciseId: null,
            exercise: null,
            set: null,
            repeat: null,
            rest: null,
            description: null,
            submitted: false,
          },
        });
      }

      addLoading.vlue = false;
    })
    .catch((error) => {
      error && $toast.error(error.message);
      addLoading.vlue = false;
    });
};
const addSession = async (i) => {
  addSessionLoading.value = true;
  const sessionData = sessions.value[i].categoryData;

  // check if categories are empty
  if (!sessionData.categorys.length) {
    $toast.error("لطفاً دسته بندی مورد نظر را انتخاب کنید");
    addSessionLoading.value = false;
  } else {
    await $axios
      .post("/Coach/AddSession", sessionData)
      .then((response) => {
        // errors
        const errorMessage = response.data.errorCode;
        switch (errorMessage) {
          case "NumberOfSessionIsFull":
            $toast.error("جلسات این برنامه تکمیل می‌باشد");
            addSessionLoading.value = false;
            return;
        }

        workoutId.value = response.data.result;
        $toast.success("جلسه با موفقیت ایجاد شد");

        const newSessionId = response.data.result;
        sessions.value[i].exerciseData.sessionId = newSessionId;

        addSessionLoading.value = false;
      })
      .catch((error) => {
        error && console.log("add session error: ", error);
        addSessionLoading.value = false;
      });
  }
};

const addExercise = async (i) => {
  addExerciseLoading.value = true;

  const sessionData = sessions.value[i].exerciseData;

  await $axios
    .post("/Coach/AddSessionExercise", sessionData)
    .then((response) => {
      console.log("add exercise response: ", response);

      sessions.value[i].exerciseData.id = response.data.result;
      sessions.value[i].exerciseData.submitted = true;

      // errors
      // const errorMessage = response.data.errorCode;
      // switch (errorMessage) {
      //   case "NumberOfSessionIsFull":
      //     $toast.error("جلسات این برنامه تکمیل می‌باشد");
      //     addExerciseLoading.value = false;
      //     return;
      // }

      $toast.success("حرکت با موفقیت افزوده شد");

      addExerciseLoading.value = false;
    })
    .catch((error) => {
      error && console.log("add exercise error: ", error);
      addExerciseLoading.value = false;
    });
};

const removeExercise = async (i) => {
  removeExerciseLoading.value = true;

  await $axios
    .delete(
      "/Coach/RemoveSessionExercise",
      {},
      {
        sessionExerciseId: sessions.value[i].exerciseData.id,
      }
    )
    .then((response) => {
      console.log("remove exercise response: ", response);

      const sessionId = sessions.value[i].exerciseData.sessionId;
      sessions.value[i].exerciseData = {
        sessionId: sessionId,
        exerciseId: null,
        exercise: null,
        set: null,
        repeat: null,
        rest: null,
        description: null,
        submitted: false,
      };

      sessions.value[i].superData.active = false;

      // errors
      // const errorMessage = response.data.errorCode;
      // switch (errorMessage) {
      //   case "NumberOfSessionIsFull":
      //     $toast.error("جلسات این برنامه تکمیل می‌باشد");
      //     removeExerciseLoading.value = false;
      //     return;
      // }

      $toast.success("حرکت با موفقیت حذف شد");

      removeExerciseLoading.value = false;
    })
    .catch((error) => {
      error && console.log("remove exercise error: ", error);
      removeExerciseLoading.value = false;
    });
};

const addSuperExercise = async (i) => {
  addSuperLoading.value = true;

  const superData = {
    sessionExerciseId: sessions.value[i].exerciseData.id,
    ...sessions.value[i].superData,
  };

  await $axios
    .post("/Coach/AddSuper", superData)
    .then((response) => {
      console.log("add super exercise response: ", response);

      sessions.value[i].superData.submitted = true;
      sessions.value[i].superData.active = false;

      // errors
      // const errorMessage = response.data.errorCode;
      // switch (errorMessage) {
      //   case "NumberOfSessionIsFull":
      //     $toast.error("جلسات این برنامه تکمیل می‌باشد");
      //     addSuperLoading.value = false;
      //     return;
      // }

      $toast.success("حرکت سوپر با موفقیت افزوده شد");

      addSuperLoading.value = false;
    })
    .catch((error) => {
      error && console.log("add super error: ", error);
      addSuperLoading.value = false;
    });
};
const removeSuper = async (i) => {
  removeSuperLoading.value = true;

  const sessionExerciseId = sessions.value[i].exerciseData.id;

  await $axios
    .post(`/Coach/RemoveSuper?sessionExerciseId=${sessionExerciseId}`)
    .then((response) => {
      console.log("remove super response: ", response);

      sessions.value[i].superData = {
        exerciseId: sessionExerciseId,
        exercise: null,
        set: null,
        repeat: null,
        rest: null,
        description: null,
        submitted: false,
        active: false,
      };
      sessions.value[i].superData2 = {
        exerciseId: sessionExerciseId,
        exercise: null,
        set: null,
        repeat: null,
        rest: null,
        description: null,
        submitted: false,
        active: false,
      };

      $toast.success("حذف حرکت سوپر با موفقیت انجام شد");

      removeSuperLoading.value = false;
    })
    .catch((error) => {
      error && console.log("remove super error: ", error);
      removeSuperLoading.value = false;
    });
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
const getCategories = async () => {
  categoriesLoading.value = true;

  await $axios
    .post(`/Category/GetAll`)
    .then((response) => {
      categories.value = response.data.result.records.map((item) => {
        return {
          title: item.name,
          value: item.name,
        };
      });
    })
    .catch((error) => error && $toast.error(error.message))
    .finally(() => {
      categoriesLoading.value = false;
    });
};

// lifecycles
onMounted(() => {
  getAthletes();
  getCategories();
});

// watchers
watch(
  () => sessions.value,
  (value) => {
    console.log("value: ", value);
  },
  { deep: true }
);
</script>

<style>
.v-input {
  @apply !min-w-full !w-full;
}
.v-input input {
  @apply !min-w-full !w-full;
}
.v-field__input:not(textarea) {
  @apply !min-h-14 h-14;
}

.category-input .v-input,
.exercise-input .v-input {
  @apply !min-w-0;
}
.category-input .v-input .v-field__outline .v-label,
.exercise-input .v-input .v-field__outline .v-label {
  @apply !bg-transparent;
}
.category-input .v-field__field,
.exercise-input .v-field__field {
  @apply !min-h-10 h-10 max-h-10;
}
.category-input .v-field__input,
.exercise-input .v-field__input {
  @apply -mt-1.5 text-sm;
}
</style>
