<template>
  <article
    class="w-full h-full flex flex-col items-start justify-between gap-4">
    <div class="w-full flex flex-col items-start justify-start gap-4">
      <div class="w-full flex items-center justify-between">
        <!-- title -->
        <h2 class="md:text-xl text-neutral-700 font-bold">لیست حرکات</h2>

        <div class="flex items-center justify-end gap-2">
          <!-- search -->
          <div
            class="w-28 md:w-52 h-7 md:h-10 px-2.5 flex items-center justify-start gap-2 border rounded-lg">
            <i-magnifying-glass class="text-neutral-300"></i-magnifying-glass>

            <input
              type="text"
              placeholder="جستجوی حرکت"
              class="w-full h-full text-[10px] md:text-sm text-neutral-700" />
          </div>

          <!-- add modal -->
          <v-btn
            rounded="lg"
            color="primary"
            variant="outlined"
            @click="addExerciseDialog = true"
            class="px-2.5 md:px-3.5 h-7 md:h-10 flex flex-center hover:bg-primary/5 transition-200">
            <i-plus-solid class="ml-1 text-sm text-primary"></i-plus-solid>
            <span class="text-[10px] md:text-sm text-primary">افزودن</span>
          </v-btn>
        </div>
      </div>

      <i-spinner-solid
        v-if="fetchLoading"
        class="mx-auto my-8 text-2xl text-primary animate-spin"></i-spinner-solid>

      <p
        v-else-if="exerciseList.length == 0"
        class="my-6 mx-auto text-neutral-600">
        در حال حاضر اطلاعاتی وجود ندارد
      </p>

      <ul
        v-if="!fetchLoading && exerciseList.length"
        class="w-full flex flex-col items-start justify-start gap-0 divide-y-[1px]">
        <li
          @click.self="
            viewExerciseData = JSON.parse(JSON.stringify(item));
            viewExerciseDialog = true;
          "
          v-for="(item, i) in exerciseList"
          :key="i"
          class="w-full h-16 p-1.5 flex items-center justify-between cursor-pointer">
          <div class="h-full flex items-center justify-start gap-4">
            <img
              @click="
                viewExerciseData = JSON.parse(JSON.stringify(item));
                viewExerciseDialog = true;
              "
              src="/img/image-placeholder.png"
              class="h-full aspect-square rounded-md"
              alt="" />

            <div
              @click="
                viewExerciseData = JSON.parse(JSON.stringify(item));
                viewExerciseDialog = true;
              "
              class="flex flex-col items-start justify-center gap-0.5">
              <p class="text-dark">{{ item.name }}</p>
              <p class="text-xs text-primary/80">{{ item.engName }}</p>
            </div>
          </div>

          <div
            @click="
              viewExerciseData = JSON.parse(JSON.stringify(item));
              viewExerciseDialog = true;
            "
            class="flex flex-col items-center justify-center gap-0.5">
            <p class="text-xs text-dark/60">{{ item.exerciseType }}</p>
            <p class="text-xs text-primary/80">{{ item.categoryId }}</p>
          </div>

          <p
            @click="
              viewExerciseData = JSON.parse(JSON.stringify(item));
              viewExerciseDialog = true;
            "
            class="w-64 text-xs text-neutral-500 line-clamp-2">
            {{ item.description }}
          </p>

          <!-- action -->
          <div class="flex items-center justify-end gap-0.5">
            <!-- edit -->
            <v-tooltip text="مشاهده" location="bottom">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="{ ...props }"
                  @click="
                    viewExerciseData = JSON.parse(JSON.stringify(item));
                    viewExerciseDialog = true;
                  "
                  class="size-5 md:size-9 text-sm 3xl:text-base hover:bg-yellow-300/10 flex flex-center rounded-full transition-200 cursor-pointer group">
                  <i-eye-solid
                    class="text-secondary/80 group-hover:text-secondary transition-200"></i-eye-solid>
                </div>
              </template>
            </v-tooltip>

            <!-- edit -->
            <v-tooltip text="ویرایش" location="bottom">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="{ ...props }"
                  @click="
                    editExerciseData = JSON.parse(JSON.stringify(item));
                    editExerciseDialog = true;
                  "
                  class="size-5 md:size-9 text-sm 3xl:text-base hover:bg-yellow-300/10 flex flex-center rounded-full transition-200 cursor-pointer group">
                  <i-pen-solid
                    class="text-yellow-300/80 group-hover:text-yellow-300 transition-200"></i-pen-solid>
                </div>
              </template>
            </v-tooltip>

            <!-- delete -->
            <v-tooltip text="حذف" location="bottom">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="{ ...props }"
                  @click="
                    deleteExerciseData = JSON.parse(JSON.stringify(item));
                    deleteExerciseDialog = true;
                  "
                  class="size-5 md:size-9 text-sm 3xl:text-base hover:bg-red-500/10 flex flex-center rounded-full transition-200 cursor-pointer group">
                  <i-trash-can-regular
                    class="text-red-500/80 group-hover:text-red-500 transition-200"></i-trash-can-regular>
                </div>
              </template>
            </v-tooltip>
          </div>
        </li>
      </ul>
    </div>

    <app-pagination
      v-bind="pagination"
      v-if="!fetchLoading && exerciseList.length"
      @update-page="updatePage($event)"></app-pagination>

    <!-- add exercise -->
    <v-dialog v-model="addExerciseDialog" @after-leave="resetExerciseData">
      <div
        class="w-80 p-4 mx-auto bg-white rounded-xl-tw"
        @keydown.enter="addExercise">
        <div
          class="w-full h-full flex flex-col items-start justify-start gap-4 py-2">
          <p class="text-sm text-neutral-600">اطلاعات حرکت جدید را وارد کنید</p>

          <div class="w-full flex flex-col items-start justify-start gap-2.5">
            <input
              type="text"
              placeholder="نام"
              v-model="addExerciseData.firstName"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

            <input
              type="text"
              v-model="addExerciseData.lastName"
              placeholder="نام خانوادگی"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

            <input
              type="text"
              v-model="addExerciseData.userName"
              placeholder="نام کاربری"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />
          </div>
        </div>

        <div class="w-full flex items-center justify-center gap-2">
          <v-btn
            color="primary"
            @click="addExercise"
            :loading="addLoading"
            :disabled="!validAddExercise"
            class="w-1/2 !h-11 rounded-lg"
            >ثبت</v-btn
          >

          <v-btn
            @click="resetExerciseData"
            variant="outlined"
            color="red"
            class="w-1/2 !h-11 rounded-lg">
            انصراف
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <!-- view exercise -->
    <v-dialog v-model="viewExerciseDialog" @after-leave="resetExerciseData">
      <div
        class="w-96 p-4 mx-auto bg-white flex flex-col items-center justify-center gap-4 rounded-xl-tw">
        <!-- header -->
        <div class="w-full flex items-center justify-between">
          <!-- title -->
          <p class="text-sm text-dark">
            {{ viewExerciseData.name }}
          </p>

          <!-- close -->
          <button
            @click="resetExerciseData"
            class="size-7 hover:bg-red-500/20 flex flex-center rounded-full transition-200 group">
            <i-xmark-solid
              class="mt-1 text-base text-neutral-400 group-hover:text-red-500 transition-200"></i-xmark-solid>
          </button>
        </div>

        <!-- image -->
        <img
          src="/img/image-placeholder.png"
          class="w-full h-56 object-cover rounded-lg"
          alt="" />

        <!-- details -->
        <ul class="w-full flex flex-col items-start justify-start gap-2">
          <!-- type -->
          <li class="flex items-center justify-start gap-2">
            <p class="text-xs 3xl:text-sm text-dark">
              نوع حرکت:
              <span class="text-primary font-bold">{{
                viewExerciseData.exerciseType
              }}</span>
            </p>
          </li>

          <!-- category -->
          <li class="flex items-center justify-start gap-2">
            <p class="text-xs 3xl:text-sm text-dark">
              دسته بندی:
              <span class="text-primary font-bold">{{
                viewExerciseData.categoryId
              }}</span>
            </p>
          </li>

          <!-- date -->
          <li class="flex items-center justify-start gap-2">
            <p class="text-xs 3xl:text-sm text-dark">
              تاریخ ایجاد:
              <span class="text-primary font-bold">{{
                viewExerciseData.creatDateShamsi
                  ? viewExerciseData.creatDateShamsi.split(" ")[0]
                  : ""
              }}</span>
            </p>
          </li>

          <!-- description -->
          <li class="flex items-center justify-start gap-2">
            <p class="text-xs 3xl:text-sm text-dark leading-5">
              توضیحات:
              <span class="font-bold">{{ viewExerciseData.description }}</span>
            </p>
          </li>
        </ul>
      </div>
    </v-dialog>

    <!-- edit exercise -->
    <v-dialog v-model="editExerciseDialog" @after-leave="resetExerciseData">
      <div class="w-80 p-4 mx-auto bg-white rounded-xl-tw">
        <div
          class="w-full h-full flex flex-col items-start justify-start gap-4 py-2">
          <p class="text-sm text-neutral-600">اطلاعات جدید حرکت را وارد کنید</p>

          <div class="w-full flex flex-col items-start justify-start gap-2.5">
            <input
              type="text"
              placeholder="نام"
              v-model="editExerciseData.firstName"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

            <input
              type="text"
              v-model="editExerciseData.lastName"
              placeholder="نام خانوادگی"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

            <input
              type="text"
              v-model="editExerciseData.userName"
              placeholder="نام کاربری"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />
          </div>
        </div>

        <div class="w-full flex items-center justify-center gap-2">
          <v-btn
            :disabled="!validEditExercise"
            class="w-1/2 !h-11 rounded-lg"
            color="primary"
            >ثبت</v-btn
          >

          <v-btn
            @click="resetExerciseData"
            variant="outlined"
            color="red"
            class="w-1/2 !h-11 rounded-lg">
            انصراف
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <!-- delete exercise -->
    <v-dialog v-model="deleteExerciseDialog" @after-leave="resetExerciseData">
      <div class="w-80 p-4 mx-auto bg-white rounded-xl-tw">
        <p class="my-4 text-center text-neutral-600">
          آیا از حذف
          <span class="font-bold">
            {{ deleteExerciseData?.firstName || "" }}
            {{ deleteExerciseData?.lastName || "" }}
          </span>
          مطمئن هستید؟
        </p>

        <div class="w-full flex items-center justify-center gap-2">
          <v-btn class="w-1/2 !h-11 rounded-lg" color="red">حذف</v-btn>

          <v-btn
            @click="resetExerciseData"
            variant="outlined"
            color="red"
            class="w-1/2 !h-11 rounded-lg">
            انصراف
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </article>
</template>

<script setup>
// variables
const nuxtApp = useNuxtApp();

// loadings
const fetchLoading = ref(false);
const addLoading = ref(false);

// dialogs
const addExerciseDialog = ref(false);
const viewExerciseDialog = ref(false);
const editExerciseDialog = ref(false);
const deleteExerciseDialog = ref(false);

// data
const exerciseList = ref([]);
const addExerciseData = ref({});
const viewExerciseData = ref({});
const editExerciseData = ref({});
const deleteExerciseData = ref({});

// pagination
const pagination = ref({
  page: 1,
  pageSize: 6,
  totalRecord: 0,
});

// computed
const validAddExercise = computed(() => {
  return (
    addExerciseData.value.firstName &&
    addExerciseData.value.lastName &&
    addExerciseData.value.userName
  );
});
const validEditExercise = computed(() => {
  return (
    editExerciseData.value.firstName &&
    editExerciseData.value.lastName &&
    editExerciseData.value.userName
  );
});

// fetch
const getExercises = async () => {
  fetchLoading.value = true;

  await nuxtApp.$axios
    .get(
      `/Exercise/GetPublicExercise?page=${pagination.value.page}&pageSize=${pagination.value.pageSize}`
    )
    .then((response) => {
      exerciseList.value = response.data.result.records;
      pagination.value.totalRecord = response.data.result.totalRecord;
    })
    .catch((error) => error && console.log("exercises error: ", error))
    .finally(() => {
      fetchLoading.value = false;
    });
};
const addExercise = async () => {
  addLoading.value = true;

  await nuxtApp.$axios
    .post("/Coach/AddExercise", addExerciseData.value)
    .then(() => {
      nuxtApp.$toast.success("عملیات با موفقیت انجام شد");
      pagination.value.page = 1;
      resetExerciseData();
      getExercises();
    })
    .catch((error) => error && console.log("add error: ", error))
    .finally(() => (addLoading.value = false));
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
  viewExerciseData.value = {};

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
  getExercises();
});
</script>
