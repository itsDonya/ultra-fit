<template>
  <article class="w-full flex flex-col items-start justify-start gap-4">
    <div class="w-full flex items-center justify-between">
      <!-- title -->
      <h2 class="md:text-xl text-neutral-700 font-bold">لیست شاگرد ها</h2>

      <div class="flex items-center justify-end gap-2">
        <!-- search -->
        <div
          class="w-28 md:w-52 h-7 md:h-10 px-2.5 flex items-center justify-start gap-2 border rounded-lg"
        >
          <i-magnifying-glass class="text-neutral-300"></i-magnifying-glass>

          <input
            type="text"
            placeholder="جستجوی شاگرد"
            class="w-full h-full text-[10px] md:text-sm text-neutral-700"
          />
        </div>

        <!-- add modal -->
        <v-dialog>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              color="primary"
              variant="outlined"
              v-bind="activatorProps"
              rounded="lg"
              class="px-2.5 md:px-3.5 h-7 md:h-10 flex flex-center hover:bg-primary/5 transition-200"
            >
              <i-plus-solid class="ml-1 text-sm text-primary"></i-plus-solid>
              <span class="text-[10px] md:text-sm text-primary">افزودن</span>
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <div class="w-80 p-4 mx-auto bg-white rounded-xl-tw">
              <div
                class="w-full h-full flex flex-col items-start justify-start gap-4 py-2"
              >
                <p class="text-sm text-neutral-600">
                  اطلاعات شاگرد جدید را وارد کنید
                </p>

                <div
                  class="w-full flex flex-col items-start justify-start gap-2.5"
                >
                  <input
                    type="text"
                    placeholder="نام"
                    v-model="pupil.firstName"
                    class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200"
                  />

                  <input
                    type="text"
                    v-model="pupil.lastName"
                    placeholder="نام خانوادگی"
                    class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200"
                  />

                  <input
                    type="text"
                    v-model="pupil.username"
                    placeholder="نام کاربری"
                    class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200"
                  />
                </div>
              </div>

              <div class="w-full flex items-center justify-center gap-2">
                <button
                  :disabled="!validPupil"
                  class="w-full h-11 bg-primary flex flex-center rounded-lg hover:brightness-90 disabled:brightness-75 transition-200"
                >
                  <span class="text-sm text-white">ثبت</span>
                </button>

                <button
                  @click="isActive.value = false"
                  class="w-full h-11 flex flex-center border rounded-lg hover:brightness-90 disabled:brightness-75 transition-200"
                >
                  <span class="text-sm text-neutral-500">انصراف</span>
                </button>
              </div>
            </div>
          </template>
        </v-dialog>
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
        <tr v-for="(item, i) in pupilsList" :key="i">
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
            {{ item.username }}
          </td>
          <td class="flex items-center justify-end gap-2">
            <!-- edit -->
            <v-tooltip text="ویرایش" location="bottom">
              <template v-slot:activator="{ props }">
                <v-dialog>
                  <template v-slot:activator="{ props: activatorProps }">
                    <div
                      v-bind="{ ...props, ...activatorProps }"
                      @click="setPupilData(item)"
                      class="size-5 md:size-9 text-sm lg:text-base hover:bg-yellow-300/10 flex flex-center rounded-full transition-200 cursor-pointer group"
                    >
                      <i-pen-solid
                        class="text-yellow-300/80 group-hover:text-yellow-300 transition-200"
                      ></i-pen-solid>
                    </div>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <div class="w-80 p-4 mx-auto bg-white rounded-xl-tw">
                      <div
                        class="w-full h-full flex flex-col items-start justify-start gap-4 py-2"
                      >
                        <p class="text-sm text-neutral-600">
                          اطلاعات جدید شاگرد را وارد کنید
                        </p>

                        <div
                          class="w-full flex flex-col items-start justify-start gap-2.5"
                        >
                          <input
                            type="text"
                            placeholder="نام"
                            v-model="pupil.firstName"
                            class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200"
                          />

                          <input
                            type="text"
                            v-model="pupil.lastName"
                            placeholder="نام خانوادگی"
                            class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200"
                          />

                          <input
                            type="text"
                            v-model="pupil.username"
                            placeholder="نام کاربری"
                            class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200"
                          />
                        </div>
                      </div>

                      <div
                        class="w-full flex items-center justify-center gap-2"
                      >
                        <button
                          :disabled="!validPupil"
                          class="w-full h-11 bg-primary flex flex-center rounded-lg hover:brightness-90 disabled:brightness-75 transition-200"
                        >
                          <span class="text-sm text-white">ثبت</span>
                        </button>

                        <button
                          @click="
                            restPupilData();
                            isActive.value = false;
                          "
                          class="w-full h-11 flex flex-center border rounded-lg hover:brightness-90 disabled:brightness-75 transition-200"
                        >
                          <span class="text-sm text-neutral-500">انصراف</span>
                        </button>
                      </div>
                    </div>
                  </template>
                </v-dialog>
              </template>
            </v-tooltip>

            <!-- delete -->
            <v-tooltip text="حذف" location="bottom">
              <template v-slot:activator="{ props }">
                <v-dialog>
                  <template v-slot:activator="{ props: activatorProps }">
                    <div
                      v-bind="{ ...props, ...activatorProps }"
                      @click="openDeleteModal(item)"
                      class="size-5 md:size-9 text-sm lg:text-base hover:bg-red-500/10 flex flex-center rounded-full transition-200 cursor-pointer group"
                    >
                      <i-trash-can-regular
                        class="text-red-500/80 group-hover:text-red-500 transition-200"
                      ></i-trash-can-regular>
                    </div>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <div class="w-80 p-4 mx-auto bg-white rounded-xl-tw">
                      <p class="my-10 text-center text-neutral-600">
                        آیا از حذف
                        <span class="font-bold">
                          {{ pupilForDelete?.firstName || "" }}
                          {{ pupilForDelete?.lastName || "" }}
                        </span>
                        مطمئن هستید؟
                      </p>

                      <div
                        class="w-full flex items-center justify-center gap-2"
                      >
                        <button
                          class="w-full h-11 bg-red-500 flex flex-center rounded-lg hover:brightness-90 disabled:brightness-75 transition-200"
                        >
                          <span class="text-sm text-white">حذف</span>
                        </button>

                        <button
                          @click="
                            isActive.value = false;
                            closeDeleteModal();
                          "
                          class="w-full h-11 flex flex-center border rounded-lg hover:brightness-90 disabled:brightness-75 transition-200"
                        >
                          <span class="text-sm text-neutral-500">انصراف</span>
                        </button>
                      </div>
                    </div>
                  </template>
                </v-dialog>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </article>
</template>

<script setup>
// variables
const pupil = ref({
  firstName: null,
  lastName: null,
  username: null,
});
const pupilForDelete = ref(null);

// modals

// data
const pupilsList = ref([
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    username: "JaneSmith",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    username: "AliceJohnson",
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    username: "BobBrown",
  },
  {
    firstName: "Charlie",
    lastName: "Davis",
    username: "CharlieDavis",
  },
  {
    firstName: "David",
    lastName: "Wilson",
    username: "DavidWilson",
  },
  {
    firstName: "Emily",
    lastName: "Miller",
    username: "EmilyMiller",
  },
  {
    firstName: "Frank",
    lastName: "Moore",
    username: "FrankMoore",
  },
]);

// computed
const validPupil = computed(() => {
  return pupil.value.firstName && pupil.value.lastName && pupil.value.username;
});

// methods
const setPupilData = (item) => {
  pupil.value.firstName = item.firstName;
  pupil.value.lastName = item.lastName;
  pupil.value.username = item.username;
};
const restPupilData = () => {
  pupil.value.firstName = null;
  pupil.value.lastName = null;
  pupil.value.username = null;
};
const openDeleteModal = (item) => {
  pupilForDelete.value = item;
};
const closeDeleteModal = () => {
  pupilForDelete.value = null;
};
</script>
