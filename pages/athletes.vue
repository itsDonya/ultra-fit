<template>
  <article class="w-full flex flex-col items-start justify-start gap-4">
    <div class="w-full flex items-center justify-between">
      <!-- title -->
      <h2 class="md:text-xl text-neutral-700 font-bold">لیست شاگرد ها</h2>

      <div class="flex items-center justify-end gap-2">
        <!-- search -->
        <div
          class="w-28 md:w-52 h-7 md:h-10 px-2.5 flex items-center justify-start gap-2 border rounded-lg">
          <i-magnifying-glass class="text-neutral-300"></i-magnifying-glass>

          <input
            type="text"
            placeholder="جستجوی شاگرد"
            class="w-full h-full text-[10px] md:text-sm text-neutral-700" />
        </div>

        <!-- add modal -->
        <v-btn
          rounded="lg"
          color="primary"
          variant="outlined"
          @click="addAthleteDialog = true"
          class="px-2.5 md:px-3.5 h-7 md:h-10 flex flex-center hover:bg-primary/5 transition-200">
          <i-plus-solid class="ml-1 text-sm text-primary"></i-plus-solid>
          <span class="text-[10px] md:text-sm text-primary">افزودن</span>
        </v-btn>
      </div>
    </div>

    <v-table class="w-full">
      <thead>
        <tr>
          <th class="text-[10px] md:text-sm lg:text-base">ردیف</th>
          <th class="text-[10px] md:text-sm lg:text-base">نام</th>
          <th class="text-[10px] md:text-sm lg:text-base">نام خانوادگی</th>
          <th class="text-[10px] md:text-sm lg:text-base">نام کاربری</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in athletesList" :key="i">
          <td class="text-[10px] md:text-sm lg:text-base">
            {{ i + 1 }}
          </td>
          <td class="text-[10px] md:text-sm lg:text-base">
            {{ item.firstName }}
          </td>
          <td class="text-[10px] md:text-sm lg:text-base">
            {{ item.lastName }}
          </td>
          <td class="text-[10px] md:text-sm lg:text-base">
            {{ item.userName }}
          </td>
          <td class="flex items-center justify-end gap-2">
            <!-- edit -->
            <v-tooltip text="ویرایش" location="bottom">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="{ ...props }"
                  @click="
                    editAthleteData = JSON.parse(JSON.stringify(item));
                    editAthleteDialog = true;
                  "
                  class="size-5 md:size-9 text-sm lg:text-base hover:bg-yellow-300/10 flex flex-center rounded-full transition-200 cursor-pointer group">
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
                    deleteAthleteData = JSON.parse(JSON.stringify(item));
                    deleteAthleteDialog = true;
                  "
                  class="size-5 md:size-9 text-sm lg:text-base hover:bg-red-500/10 flex flex-center rounded-full transition-200 cursor-pointer group">
                  <i-trash-can-regular
                    class="text-red-500/80 group-hover:text-red-500 transition-200"></i-trash-can-regular>
                </div>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- add athlete -->
    <v-dialog v-model="addAthleteDialog" @after-leave="resetAthleteData">
      <div class="w-80 p-4 mx-auto bg-white rounded-xl-tw">
        <div
          class="w-full h-full flex flex-col items-start justify-start gap-4 py-2">
          <p class="text-sm text-neutral-600">
            اطلاعات شاگرد جدید را وارد کنید
          </p>

          <div class="w-full flex flex-col items-start justify-start gap-2.5">
            <input
              type="text"
              placeholder="نام"
              v-model="addAthleteData.firstName"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

            <input
              type="text"
              v-model="addAthleteData.lastName"
              placeholder="نام خانوادگی"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

            <input
              type="text"
              v-model="addAthleteData.userName"
              placeholder="نام کاربری"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />
          </div>
        </div>

        <div class="w-full flex items-center justify-center gap-2">
          <button
            :disabled="!validAddAthlete"
            class="w-full h-11 bg-primary flex flex-center rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
            <span class="text-sm text-white">ثبت</span>
          </button>

          <button
            @click="resetAthleteData"
            class="w-full h-11 flex flex-center border rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
            <span class="text-sm text-neutral-500">انصراف</span>
          </button>
        </div>
      </div>
    </v-dialog>

    <!-- edit athlete -->
    <v-dialog v-model="editAthleteDialog" @after-leave="resetAthleteData">
      <div class="w-80 p-4 mx-auto bg-white rounded-xl-tw">
        <div
          class="w-full h-full flex flex-col items-start justify-start gap-4 py-2">
          <p class="text-sm text-neutral-600">
            اطلاعات جدید شاگرد را وارد کنید
          </p>

          <div class="w-full flex flex-col items-start justify-start gap-2.5">
            <input
              type="text"
              placeholder="نام"
              v-model="editAthleteData.firstName"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

            <input
              type="text"
              v-model="editAthleteData.lastName"
              placeholder="نام خانوادگی"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

            <input
              type="text"
              v-model="editAthleteData.userName"
              placeholder="نام کاربری"
              class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />
          </div>
        </div>

        <div class="w-full flex items-center justify-center gap-2">
          <button
            :disabled="!validEditAthlete"
            class="w-full h-11 bg-primary flex flex-center rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
            <span class="text-sm text-white">ثبت</span>
          </button>

          <button
            @click="resetAthleteData"
            class="w-full h-11 flex flex-center border rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
            <span class="text-sm text-neutral-500">انصراف</span>
          </button>
        </div>
      </div>
    </v-dialog>

    <!-- delete athlete -->
    <v-dialog v-model="deleteAthleteDialog" @after-leave="resetAthleteData">
      <div class="w-80 p-4 mx-auto bg-white rounded-xl-tw">
        <p class="my-10 text-center text-neutral-600">
          آیا از حذف
          <span class="font-bold">
            {{ deleteAthleteData?.firstName || "" }}
            {{ deleteAthleteData?.lastName || "" }}
          </span>
          مطمئن هستید؟
        </p>

        <div class="w-full flex items-center justify-center gap-2">
          <button
            class="w-full h-11 bg-red-500 flex flex-center rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
            <span class="text-sm text-white">حذف</span>
          </button>

          <button
            @click="resetAthleteData"
            class="w-full h-11 flex flex-center border rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
            <span class="text-sm text-neutral-500">انصراف</span>
          </button>
        </div>
      </div>
    </v-dialog>
  </article>
</template>

<script setup>
// variables
const nuxtApp = useNuxtApp();

// dialogs
const addAthleteDialog = ref(false);
const editAthleteDialog = ref(false);
const deleteAthleteDialog = ref(false);

// data
const athletesList = ref([]);
const addAthleteData = ref({});
const editAthleteData = ref({});
const deleteAthleteData = ref({});

// computed
const validAddAthlete = computed(() => {
  return (
    addAthleteData.value.firstName &&
    addAthleteData.value.lastName &&
    addAthleteData.value.userName
  );
});
const validEditAthlete = computed(() => {
  return (
    editAthleteData.value.firstName &&
    editAthleteData.value.lastName &&
    editAthleteData.value.userName
  );
});

// fetch
const getAthletes = async () => {
  await nuxtApp.$axios
    .get("/Coach/GetMyAthlete", { page: 1, pageSize: 10 })
    .then((response) => {
      athletesList.value = response.data.result.records;
    })
    .catch((error) => error && console.log("athletes error: ", error));
};

// methods
const resetAthleteData = () => {
  // dialogs
  closeDialogs();

  // add data
  addAthleteData.value = {};

  // edit data
  editAthleteData.value = {};

  // delete data
  deleteAthleteData.value = {};
};
const closeDialogs = () => {
  addAthleteDialog.value = false;
  editAthleteDialog.value = false;
  deleteAthleteDialog.value = false;
};

// lifecycles
onMounted(() => {
  getAthletes();
});
</script>
