<template>
  <div
    class="w-full max-h-screen mx-auto !pb-24 p-6 flex flex-center rounded-xl-tw overflow-auto"
  >
    <v-window v-model="step" class="m-auto">
      <v-window-item>
        <div
          class="workout-fields sm:w-[540px] sm:!min-w-[540px] py-2 flex flex-col items-start justify-center gap-4"
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
            <template v-for="(session, i) in sessionsCount">
              <v-expansion-panel :disabled="sessions[i].removed">
                <!-- title -->
                <v-expansion-panel-title>
                  <div class="w-full flex items-center justify-between">
                    <p :class="sessions[i].removed ? 'line-through' : ''">
                      {{ persianSessions[i] }}
                    </p>

                    <div
                      @click="removeSession($event, i)"
                      v-if="
                        !sessions[i].removed &&
                        sessions[i].exerciseData.sessionId
                      "
                      class="size-8 hover:bg-neutral-200 flex-center rounded-full transition-200 z-[20]"
                    >
                      <i-trash-can-regular
                        class="text-red-500"
                      ></i-trash-can-regular>
                    </div>
                  </div>

                  <!-- <v-dialog v-model="deleteSessionDialog" max-width="500">
                      <v-card class="rounded-lg !p-4">
                        <p class="text-[14px] text-red pt-1">
                          <v-icon size="large" class="ml-2"
                            >mdi-alert-circle</v-icon
                          >
                          از حذف
                          <span class="font-bold">{{ persianSessions[i] }}</span>
                          اطمینان دارید؟ <br />
                          اطلاعات ثبت شده قابل بازیابی نخواهد بود
                        </p>
    
                        <div class="mt-6 flex items-center justify-end gap-2">
                          <v-btn color="red" @click="deleteSessionDialog = false"
                            >بستن</v-btn
                          >
                          <v-btn
                            @click="
                              removeSession($event, i);
                              deleteSessionDialog = false;
                            "
                            color="red"
                            variant="tonal"
                            class="!border-[1px] !border-red"
                            >حذف</v-btn
                          >
                        </div>
                      </v-card>
                    </v-dialog> -->
                </v-expansion-panel-title>

                <!-- body -->
                <v-expansion-panel-text v-if="!sessions[i].removed">
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
                          <i-check-solid
                            class="text-primary tex"
                          ></i-check-solid>
                        </v-btn>
                      </div>
                    </div>

                    <template v-if="sessions[i].exerciseData.sessionId">
                      <span
                        class="w-full h-[1px] bg-neutral-300/80 rounded-[50%]"
                      ></span>

                      <!-- submitted (regular) -->
                      <div
                        v-if="sessions[i].exerciseData.submitted"
                        class="w-full h-12 pr-4 pl-1.5 mt-2 bg-white flex items-center justify-between border-r-4 border-secondary rounded-lg shadow"
                      >
                        <p class="text-dark font-bold">
                          {{ sessions[i].exerciseData.exercise }}
                          <span
                            class="mr-2 text-sm text-neutral-400 font-normal"
                            >{{ sessions[i].exerciseData.set }} ست
                            {{ sessions[i].exerciseData.repeat }} تایی</span
                          >
                        </p>

                        <v-btn
                          variant="text"
                          color="red"
                          rounded="md"
                          :loading="removeExerciseLoading"
                          @click="deleteExerciseDialog = true"
                          >حذف</v-btn
                        >
                      </div>

                      <!-- delete confirmation -->
                      <v-dialog v-model="deleteExerciseDialog" max-width="500">
                        <v-card class="rounded-lg !p-4">
                          <p class="text-[14px] text-red pt-1">
                            <v-icon size="large" class="ml-2"
                              >mdi-alert-circle</v-icon
                            >
                            با حذف حرکت این جلسه، تمامی حرکات سوپر نیز حذف
                            می‌شوند
                          </p>

                          <div class="mt-6 flex items-center justify-end gap-2">
                            <v-btn
                              color="red"
                              @click="deleteExerciseDialog = false"
                              >بستن</v-btn
                            >
                            <v-btn
                              @click="removeExercise(i)"
                              color="red"
                              variant="tonal"
                              class="!border-[1px] !border-red"
                              >حذف</v-btn
                            >
                          </div>
                        </v-card>
                      </v-dialog>

                      <!-- submitted (super) -->
                      <span
                        v-if="sessions[i].superData.submitted"
                        class="w-full h-[1px] mt-4 bg-neutral-300/80 rounded-[50%]"
                      ></span>

                      <div
                        v-if="sessions[i].superData.submitted"
                        class="w-full h-12 pr-4 mt-2 bg-white flex items-center justify-between border-r-4 border-teal-500 rounded-lg shadow overflow-hidden"
                      >
                        <p class="text-dark font-bold">
                          {{ sessions[i].superData.exercise }}
                          <span
                            class="mr-2 text-sm text-neutral-400 font-normal"
                          >
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

                      <div
                        v-if="sessions[i].superData2.submitted"
                        class="w-full h-12 pr-4 bg-white flex items-center justify-between border-r-4 border-teal-500 rounded-lg shadow overflow-hidden"
                      >
                        <p class="text-dark font-bold">
                          {{ sessions[i].superData2.exercise }}
                          <span
                            class="mr-2 text-sm text-neutral-400 font-normal"
                          >
                            {{ sessions[i].superData2.set }} ست
                            {{ sessions[i].superData2.repeat }} تایی
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
                            class="mb-1 *:*:pl-0.5"
                            variant="outlined"
                            @input="sessions[i].exerciseData.exerciseId = null"
                            :disabled="
                              addExerciseLoading ||
                              !sessions[i].exerciseData.sessionId
                            "
                            v-model="sessions[i].exerciseData.exercise"
                          >
                            <template #append-inner>
                              <v-btn
                                rounded="lg"
                                color="primary"
                                @click="showExercises(i)"
                                class="!min-w-max !w-max !max-w-max"
                              >
                                <i-magnifying-glass-solid
                                  class="text-white"
                                ></i-magnifying-glass-solid>
                              </v-btn>
                            </template>
                          </v-text-field>
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
                              !sessions[i].exerciseData.sessionId ||
                              !(
                                sessions[i].exerciseData.exercise ||
                                sessions[i].exerciseData.exerciseId
                              ) ||
                              !sessions[i].exerciseData.set ||
                              !sessions[i].exerciseData.repeat
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
                            !sessions[i].superData.active &&
                            !(
                              sessions[i].superData.submitted &&
                              sessions[i].superData2.submitted
                            )
                          "
                          @click="
                            sessions[i].superData.submitted
                              ? (sessions[i].superData2.active = true)
                              : (sessions[i].superData.active = true)
                          "
                        >
                          <i-plus-solid
                            class="ml-2 text-primary"
                          ></i-plus-solid>
                          <span>افزودن حرکت سوپر</span>
                        </v-btn>
                        <span v-else></span>

                        <v-btn
                          variant="text"
                          color="red"
                          rounded="md"
                          @click="deleteSuperDialog = true"
                          :loading="removeSuperLoading"
                          v-if="sessions[i].superData.submitted"
                          >حذف حرکات سوپر</v-btn
                        >

                        <v-dialog v-model="deleteSuperDialog" max-width="500">
                          <v-card class="rounded-lg !p-4">
                            <p class="text-[14px] text-red pt-1">
                              <v-icon size="large" class="ml-2"
                                >mdi-alert-circle</v-icon
                              >
                              {{
                                sessions[i].superData2.submitted
                                  ? "توجه داشته باشید که تمامی حرکات سوپر حذف خواهند شد"
                                  : "از حذف حرکت سوپر مطمئن هستید؟"
                              }}
                            </p>

                            <div
                              class="mt-6 flex items-center justify-end gap-2"
                            >
                              <v-btn
                                color="red"
                                @click="deleteSuperDialog = false"
                                >بستن</v-btn
                              >
                              <v-btn
                                @click="
                                  removeSuper(i);
                                  deleteSuperDialog = false;
                                "
                                color="red"
                                variant="tonal"
                                class="!border-[1px] !border-red"
                                >حذف</v-btn
                              >
                            </div>
                          </v-card>
                        </v-dialog>
                      </div>

                      <!-- exercises dialog -->
                      <v-dialog v-model="exercisesDialog">
                        <v-card
                          rounded="lg"
                          class="exercises-modal w-[600px] h-screen m-auto p-4 bg-white gap-4"
                        >
                          <!-- header -->
                          <div class="w-full flex items-center justify-between">
                            <p class="text-dark">
                              انتخاب حرکت برای {{ persianSessions[i] }}
                            </p>

                            <div
                              @click="exercisesDialog = false"
                              class="size-9 hover:bg-neutral-400/10 flex-center rounded-full transition-200 cursor-pointer"
                            >
                              <i-xmark-solid
                                class="text-neutral-600"
                              ></i-xmark-solid>
                            </div>
                          </div>

                          <div class="w-full">
                            <v-tabs v-model="exercisesWindow">
                              <v-tab>حرکات عمومی</v-tab>
                              <v-tab>حرکات من</v-tab>
                            </v-tabs>
                          </div>

                          <v-window v-model="exercisesWindow" class="min-h-max">
                            <!-- general -->
                            <v-window-item class="min-h-max">
                              <div
                                class="w-full md:w-auto mb-4 pt-2 flex items-center justify-end gap-2"
                              >
                                <!-- search -->
                                <v-text-field
                                  clearable
                                  label="جستجو"
                                  color="secondary"
                                  variant="outlined"
                                  hide-details
                                  v-model="generalExerciseFilters.search"
                                ></v-text-field>

                                <!-- category -->
                                <v-select
                                  clearable
                                  color="secondary"
                                  label="دسته بندی"
                                  variant="outlined"
                                  hide-details
                                  :items="exerciseCategories"
                                  :loading="categoriesLoading"
                                  v-model="generalExerciseFilters.categoryId"
                                ></v-select>

                                <!-- type -->
                                <v-select
                                  clearable
                                  color="secondary"
                                  label="نوع حرکت"
                                  variant="outlined"
                                  hide-details
                                  :items="typesList"
                                  v-model="generalExerciseFilters.exerciseType"
                                ></v-select>
                              </div>

                              <i-spinner-solid
                                v-if="generalExercisesLoading"
                                class="mx-auto my-8 text-2xl text-primary animate-spin"
                              ></i-spinner-solid>

                              <p
                                v-else-if="generalExercises.length == 0"
                                class="my-6 mx-auto text-neutral-600"
                              >
                                در حال حاضر اطلاعاتی وجود ندارد
                              </p>

                              <ul
                                v-if="
                                  !generalExercisesLoading &&
                                  generalExercises.length
                                "
                                class="w-full min-h-max grid grid-cols-4 items-start justify-start gap-4"
                              >
                                <li
                                  @click="setSelectedExercise(i, item)"
                                  v-for="(item, index) in generalExercises"
                                  :key="index"
                                  class="w-full p-1.5 hover:bg-secondary/20 flex flex-col items-start justify-start gap-2 rounded-md cursor-pointer transition-200"
                                >
                                  <img
                                    :src="
                                      item.logo
                                        ? $config.public.imageCdn + item.logo
                                        : '/img/image-placeholder.png'
                                    "
                                    class="w-full aspect-square object-cover origin-center rounded-md"
                                    alt=""
                                  />

                                  <div
                                    class="w-full flex flex-col items-start gap-0.5"
                                  >
                                    <p class="text-sm text-dark line-clamp-1">
                                      {{ item.name }}
                                    </p>
                                    <p
                                      class="text-xs text-primary/80 line-clamp-1"
                                    >
                                      {{ item.engName }}
                                    </p>
                                  </div>
                                </li>
                              </ul>

                              <app-pagination
                                class="mt-4"
                                v-bind="generalExercisesPagination"
                                v-if="
                                  !generalExercisesLoading &&
                                  generalExercises.length
                                "
                                @update-page="updatePage($event)"
                              ></app-pagination>
                            </v-window-item>

                            <!-- custom -->
                            <v-window-item class="min-h-max">
                              <div
                                class="w-full md:w-auto mb-4 pt-2 flex items-center justify-end gap-2"
                              >
                                <!-- search -->
                                <v-text-field
                                  clearable
                                  label="جستجو"
                                  color="secondary"
                                  variant="outlined"
                                  hide-details
                                  v-model="customExerciseFilters.search"
                                ></v-text-field>

                                <!-- category -->
                                <v-select
                                  clearable
                                  color="secondary"
                                  label="دسته بندی"
                                  variant="outlined"
                                  hide-details
                                  :items="exerciseCategories"
                                  :loading="categoriesLoading"
                                  v-model="customExerciseFilters.categoryId"
                                ></v-select>

                                <!-- type -->
                                <v-select
                                  clearable
                                  color="secondary"
                                  label="نوع حرکت"
                                  variant="outlined"
                                  hide-details
                                  :items="typesList"
                                  v-model="customExerciseFilters.exerciseType"
                                ></v-select>
                              </div>

                              <i-spinner-solid
                                v-if="customExercisesLoading"
                                class="mx-auto my-8 text-2xl text-primary animate-spin"
                              ></i-spinner-solid>

                              <p
                                v-else-if="customExercises.length == 0"
                                class="my-6 mx-auto text-neutral-600"
                              >
                                در حال حاضر اطلاعاتی وجود ندارد
                              </p>

                              <ul
                                v-if="
                                  !customExercisesLoading &&
                                  customExercises.length
                                "
                                class="w-full min-h-max grid grid-cols-4 items-start justify-start gap-4"
                              >
                                <li
                                  @click="setSelectedExercise(i, item)"
                                  v-for="(item, index) in customExercises"
                                  :key="index"
                                  class="w-full p-1.5 hover:bg-secondary/20 flex flex-col items-start justify-start gap-2 rounded-md cursor-pointer transition-200"
                                >
                                  <img
                                    :src="
                                      item.logo
                                        ? $config.public.imageCdn + item.logo
                                        : '/img/image-placeholder.png'
                                    "
                                    class="w-full aspect-square object-cover origin-center rounded-md"
                                    alt=""
                                  />

                                  <div
                                    class="w-full flex flex-col items-start gap-0.5"
                                  >
                                    <p class="text-sm text-dark line-clamp-1">
                                      {{ item.name }}
                                    </p>
                                    <p
                                      class="text-xs text-primary/80 line-clamp-1"
                                    >
                                      {{ item.engName }}
                                    </p>
                                  </div>
                                </li>
                              </ul>

                              <app-pagination
                                class="mt-4"
                                v-bind="customExercisesPagination"
                                v-if="
                                  !customExercisesLoading &&
                                  customExercises.length
                                "
                                @update-page="updatePage($event)"
                              ></app-pagination>
                            </v-window-item>
                          </v-window>
                        </v-card>
                      </v-dialog>
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
                            class="mb-1 *:*:pl-0.5"
                            variant="outlined"
                            :disabled="addSuperLoading"
                            @input="sessions[i].superData.exerciseId = null"
                            v-model="sessions[i].superData.exercise"
                          >
                            <template #append-inner>
                              <v-btn
                                rounded="lg"
                                color="primary"
                                @click="showExercises(i)"
                                class="!min-w-max !w-max !max-w-max"
                              >
                                <i-magnifying-glass-solid
                                  class="text-white"
                                ></i-magnifying-glass-solid>
                              </v-btn>
                            </template>
                          </v-text-field>
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
                            :disabled="
                              addSuperLoading ||
                              !(
                                sessions[i].superData.exercise ||
                                sessions[i].superData.exerciseId
                              ) ||
                              !sessions[i].superData.set ||
                              !sessions[i].superData.repeat
                            "
                            @click="addSuperExercise(i)"
                            >ثبت حرکت سوپر</v-btn
                          >
                        </v-col>
                      </v-row>
                    </template>

                    <!-- ---- super 2 ---- -->
                    <template
                      v-if="
                        sessions[i].exerciseData.submitted &&
                        sessions[i].superData.submitted &&
                        sessions[i].superData2.active
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
                            class="mb-1 *:*:pl-0.5"
                            variant="outlined"
                            :disabled="addSuperLoading"
                            @input="sessions[i].superData2.exerciseId = null"
                            v-model="sessions[i].superData2.exercise"
                          >
                            <template #append-inner>
                              <v-btn
                                rounded="lg"
                                color="primary"
                                @click="showExercises(i)"
                                class="!min-w-max !w-max !max-w-max"
                              >
                                <i-magnifying-glass-solid
                                  class="text-white"
                                ></i-magnifying-glass-solid>
                              </v-btn>
                            </template>
                          </v-text-field>
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
                            v-model.number="sessions[i].superData2.set"
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
                            v-model="sessions[i].superData2.repeat"
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
                            v-model.number="sessions[i].superData2.rest"
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
                            v-model="sessions[i].superData2.description"
                          ></v-textarea>
                        </v-col>

                        <v-col cols="12" v-if="sessions[i].superData2.active">
                          <v-btn
                            block
                            class="h-10"
                            rounded="lg"
                            variant="outlined"
                            color="teal"
                            :disabled="
                              addSuperLoading ||
                              !(
                                sessions[i].superData2.exercise ||
                                sessions[i].superData2.exerciseId
                              ) ||
                              !sessions[i].superData2.set ||
                              !sessions[i].superData2.repeat
                            "
                            @click="addSuperExercise(i)"
                            >ثبت حرکت سوپر</v-btn
                          >
                        </v-col>
                      </v-row>
                    </template>
                  </div>

                  <v-btn
                    color="teal"
                    variant="text"
                    rounded="sm"
                    @click="panels = [i + 1]"
                    v-if="i + 1 < sessionsCount"
                    class="block !place-self-end !self-end !justify-self-end"
                  >
                    <span class="text-teal-500">رفتن به جلسه‌ی بعد</span>
                    <i-arrow-left
                      class="text-teal-500 mt-1 mr-2"
                    ></i-arrow-left>
                  </v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </template>
          </v-expansion-panels>

          <v-btn
            block
            color="primary"
            to="/workouts/mine"
            class="!h-11 rounded-lg"
            >ثبت نهایی و ایجاد برنامه</v-btn
          >
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { typesList } from "@/utils/types";
import { watch } from "vue";

// variables
const step = ref(0);
const panels = ref([0]);
const stopped = ref(false);
const exercisesWindow = ref(0);
const { $toast, $axios } = useNuxtApp();

// dialogs
const exercisesDialog = ref(false);
const deleteSuperDialog = ref(false);
const deleteSessionDialog = ref(false);
const deleteExerciseDialog = ref(false);

// loadings
const addLoading = ref(false);
const addSuperLoading = ref(false);
const athletesLoading = ref(false);
const categoriesLoading = ref(false);
const addSessionLoading = ref(false);
const addExerciseLoading = ref(false);
const removeSuperLoading = ref(false);
const removeSessionLoading = ref(false);
const removeExerciseLoading = ref(false);
const customExercisesLoading = ref(false);
const generalExercisesLoading = ref(false);

// filters
const generalExerciseFilters = ref({
  search: null,
  categoryId: null,
  exerciseType: null,
});
const customExerciseFilters = ref({
  search: null,
  categoryId: null,
  exerciseType: null,
});

// pagination
const generalExercisesPagination = ref({
  page: 1,
  pageSize: 12,
  totalRecord: 0,
});
const customExercisesPagination = ref({
  page: 1,
  pageSize: 12,
  totalRecord: 0,
});

// data
const athletes = ref([]);
const sessions = ref([]);
const categories = ref([]);
const workoutId = ref(null);
const sessionsCount = ref(0);
const customExercises = ref([]);
const generalExercises = ref([]);
const exerciseCategories = ref([]);
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
        console.log("newSessionId: ", newSessionId);

        sessions.value[i].exerciseData.sessionId = newSessionId;
        console.log("set: ", sessions.value[i].exerciseData.sessionId);

        addSessionLoading.value = false;
      })
      .catch((error) => {
        (error.message && $toast.error(error.message)) ||
          console.log("add session error: ", error);
        addSessionLoading.value = false;
      });
  }
};

const addExercise = async (i) => {
  addExerciseLoading.value = true;

  const exerciseData = sessions.value[i].exerciseData;
  console.log("exerciseData: ", exerciseData);

  await $axios
    .post("/Coach/AddSessionExercise", {
      ...exerciseData,
      exercise: exerciseData.exerciseId ? null : exerciseData.exercise,
    })
    .then((response) => {
      console.log("add exercise response: ", response);

      const resultId = response.data.result;

      if (resultId == 0) {
        addExerciseLoading.value = 0;
        $toast.error("حرکت انتخاب شده صحیح نمی‌باشد؛ دوباره تلاش کنید");
        return;
      }

      sessions.value[i].exerciseData.id = resultId;
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
      (error.message && $toast.error(error.message)) ||
        console.log("add exercise error: ", error);
      addExerciseLoading.value = false;
    });
};

const removeSession = async (e, i) => {
  e.stopPropagation();

  deleteSessionDialog.value = true;

  const sessionId = sessions.value[i].exerciseData.sessionId;
  console.log("sessionId: ", sessions.value[i]);

  await $axios
    .delete(`/Coach/RemoveSession?sessionId=${sessionId}`)
    .then((response) => {
      console.log("remove session response: ", response);

      // errors
      const errorMessage = response.data.errorCode;
      if (errorMessage == "SessionHasExercise") {
        $toast.error("برای حذف جلسه ابتدا تمامی حرکات آن را پاک کنید");
        deleteSessionDialog.value = false;
        return;
      }

      sessions.value[i].removed = true;

      deleteSessionDialog.value = false;

      panels.value = [];

      $toast.success("جلسه با موفقیت حذف شد");

      removeSessionLoading.value = false;
    })
    .catch((error) => {
      (error.message && $toast.error(error.message)) ||
        console.log("remove session error: ", error);
      removeSessionLoading.value = false;
    });
};

const removeExercise = async (i) => {
  removeExerciseLoading.value = true;

  const sessionExerciseId = sessions.value[i].exerciseData.id;

  await $axios
    .delete(
      `/Coach/RemoveSessionExercise?sessionExerciseId=${sessionExerciseId}`
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
      sessions.value[i].superData = {
        exerciseId: null,
        exercise: null,
        set: null,
        repeat: null,
        rest: null,
        description: null,
        submitted: false,
        active: false,
      };
      sessions.value[i].superData2 = {
        exerciseId: null,
        exercise: null,
        set: null,
        repeat: null,
        rest: null,
        description: null,
        submitted: false,
        active: false,
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

      deleteExerciseDialog.value = false;

      $toast.success("حرکت با موفقیت حذف شد");

      removeExerciseLoading.value = false;
    })
    .catch((error) => {
      (error.message && $toast.error(error.message)) ||
        console.log("remove exercise error: ", error);
      removeExerciseLoading.value = false;
    });
};

const addSuperExercise = async (i) => {
  addSuperLoading.value = true;

  const superData = {
    sessionExerciseId: sessions.value[i].exerciseData.id,
    ...(sessions.value[i].superData.submitted
      ? {
          ...sessions.value[i].superData2,
          exercise: sessions.value[i].superData2.exerciseId
            ? null
            : sessions.value[i].superData2.exercise,
        }
      : {
          ...sessions.value[i].superData,
          exercise: sessions.value[i].superData.exerciseId
            ? null
            : sessions.value[i].superData.exercise,
        }),
  };

  await $axios
    .post("/Coach/AddSuper", superData)
    .then((response) => {
      console.log("add super exercise response: ", response);

      // errors
      const errorMessage = response.data.errorCode;
      switch (errorMessage) {
        case "SessionExerciseDoesntExists":
          $toast.error("هنوز حرکتی برای این جلسه ثبت نکردید");

          addSuperLoading.value = false;

          sessions.value[i].superData = {
            exerciseId: null,
            exercise: null,
            set: null,
            repeat: null,
            rest: null,
            description: null,
            submitted: false,
            active: false,
          };
          sessions.value[i].superData2 = {
            exerciseId: null,
            exercise: null,
            set: null,
            repeat: null,
            rest: null,
            description: null,
            submitted: false,
            active: false,
          };
          return;
      }

      if (sessions.value[i].superData.submitted) {
        sessions.value[i].superData2.submitted = true;
        sessions.value[i].superData2.active = false;
      } else {
        sessions.value[i].superData.submitted = true;
        sessions.value[i].superData.active = false;
      }

      $toast.success("حرکت سوپر با موفقیت افزوده شد");

      addSuperLoading.value = false;
    })
    .catch((error) => {
      (error.message && $toast.error(error.message)) ||
        console.log("add super error: ", error);
      addSuperLoading.value = false;
      sessions.value[i].superData.active = false;
    });
};

const removeSuper = async (i) => {
  removeSuperLoading.value = true;

  const sessionExerciseId = sessions.value[i].exerciseData.id;

  await $axios
    .post(`/Coach/RemoveSuper?sessionExerciseId=${sessionExerciseId}`)
    .then((response) => {
      console.log("remove super response: ", response);

      // errors
      const errorMessage = response.data.errorCode;
      switch (errorMessage) {
        case "SessionExerciseDoesntExists":
          $toast.error("هنوز حرکتی برای این جلسه ثبت نکردید");
          addSuperLoading.value = false;
          return;
      }

      sessions.value[i].superData = {
        exerciseId: null,
        exercise: null,
        set: null,
        repeat: null,
        rest: null,
        description: null,
        submitted: false,
        active: false,
      };
      sessions.value[i].superData2 = {
        exerciseId: null,
        exercise: null,
        set: null,
        repeat: null,
        rest: null,
        description: null,
        submitted: false,
        active: false,
      };

      $toast.success("حذف حرکات سوپر با موفقیت انجام شد");

      removeSuperLoading.value = false;
    })
    .catch((error) => {
      (error.message && $toast.error(error.message)) ||
        console.log("remove super error: ", error);
      removeSuperLoading.value = false;
    });
};

const showExercises = async (i) => {
  exercisesDialog.value = true;
};

const setSelectedExercise = (index, item) => {
  // sessions.value[index].exerciseData.exerciseId = item.id;
  // sessions.value[index].exerciseData.exercise = item.name;

  if (
    sessions.value[index].superData2.active &&
    !sessions.value[index].superData2.submitted
  ) {
    sessions.value[index].superData2.exerciseId = item.id;
    sessions.value[index].superData2.exercise = item.name;
  } else if (
    sessions.value[index].superData.active &&
    !sessions.value[index].superData.submitted
  ) {
    sessions.value[index].superData.exerciseId = item.id;
    sessions.value[index].superData.exercise = item.name;
  } else {
    sessions.value[index].exerciseData.exerciseId = item.id;
    sessions.value[index].exerciseData.exercise = item.name;
  }

  exercisesDialog.value = false;

  customExercises.value = {};
  generalExercises.value = {};

  customExerciseFilters.value = {
    search: null,
    categoryId: null,
    exerciseType: null,
  };
  generalExerciseFilters.value = {
    search: null,
    categoryId: null,
    exerciseType: null,
  };

  customExercisesPagination.value = {
    page: 1,
    pageSize: 12,
    totalRecord: 0,
  };
  generalExercisesPagination.value = {
    page: 1,
    pageSize: 12,
    totalRecord: 0,
  };

  getGeneralExercises();
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
      exerciseCategories.value = response.data.result.records.map((item) => {
        return {
          title: item.name,
          value: item.id,
        };
      });
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
const getCustomExercises = async () => {
  customExercisesLoading.value = true;

  await $axios
    .post(`/Exercise/GetCoachExercise`, {
      ...customExercisesPagination.value,
      ...customExerciseFilters.value,
    })
    .then((response) => {
      customExercises.value = response.data.result.records;
      customExercisesPagination.value.totalRecord =
        response.data.result.totalRecord;
      customExercisesLoading.value = false;
    })
    .catch((error) => {
      error && console.log("exercises error: ", error);
      customExercisesLoading.value = false;
    });
};
const getGeneralExercises = async () => {
  generalExercisesLoading.value = true;

  await $axios
    .post(`/Exercise/GetPublicExercise`, {
      ...generalExercisesPagination.value,
      ...generalExerciseFilters.value,
    })
    .then((response) => {
      generalExercises.value = response.data.result.records;
      generalExercisesPagination.value.totalRecord =
        response.data.result.totalRecord;
      generalExercisesLoading.value = false;
    })
    .catch((error) => {
      error && console.log("exercises error: ", error);
      generalExercisesLoading.value = false;
    });
};
const updatePage = (pageNumber) => {
  if (exercisesWindow.value == 0) {
    generalExercisesPagination.value.page = pageNumber;
    getGeneralExercises();
  } else if (exercisesWindow.value == 1) {
    customExercisesPagination.value.page = pageNumber;
    getCustomExercises();
  }
};

// lifecycles
onMounted(() => {
  getAthletes();
  getCategories();
  getCustomExercises();
  getGeneralExercises();
});

// watchers
watch(
  () => sessions.value,
  (value) => {
    console.log("value: ", value);
  },
  { deep: true }
);
watch(
  () => generalExerciseFilters.value,
  () => {
    updatePage(1);
    getGeneralExercises();
  },
  { deep: true }
);
watch(
  () => customExerciseFilters.value,
  () => {
    updatePage(1);
    getCustomExercises();
  },
  { deep: true }
);
watch(
  () => exercisesDialog.value,
  (value) => {
    if (!value) {
      customExerciseFilters.value = {
        search: null,
        categoryId: null,
        exerciseType: null,
      };
      generalExerciseFilters.value = {
        search: null,
        categoryId: null,
        exerciseType: null,
      };

      customExercisesPagination.value = {
        page: 1,
        pageSize: 12,
        totalRecord: 0,
      };
      generalExercisesPagination.value = {
        page: 1,
        pageSize: 12,
        totalRecord: 0,
      };
    }
  }
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

.exercises-modal .v-input,
.category-input .v-input,
.exercise-input .v-input {
  @apply !min-w-0;
}
.workout-fields .v-input .v-field__outline .v-label,
.exercises-modal .v-input .v-field__outline .v-label,
.category-input .v-input .v-field__outline .v-label,
.exercise-input .v-input .v-field__outline .v-label {
  @apply !bg-transparent;
}
.exercises-modal .v-field__field,
.category-input .v-field__field,
.exercise-input .v-field__field {
  @apply !min-h-10 h-10 max-h-10;
}
.exercises-modal .v-field__input,
.category-input .v-field__input,
.exercise-input .v-field__input {
  @apply -mt-1.5 text-sm;
}
</style>

<style lang="scss">
.exercises-modal {
  .v-tabs {
    .v-btn {
      border-radius: 10px 10px 0 0 !important;
    }

    .v-btn:not(.v-tab--selected) {
      color: #036ab380 !important;
    }
    .v-btn.v-tab--selected {
      color: #036ab3 !important;
      background-color: #a4d8fc60;
    }
  }
}
</style>
