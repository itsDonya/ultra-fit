<template>
  <article class="w-full p-6 flex flex-col items-start justify-start gap-6">
    <div class="w-full flex items-center justify-between">
      <!-- title -->
      <h2 class="text-xl text-neutral-700 font-bold">لیست شاگرد ها</h2>

      <div class="flex items-center justify-end gap-2">
        <!-- search -->
        <div
          class="w-3/6 md:w-52 h-8 md:h-10 px-2.5 flex items-center justify-start gap-2 border border-neutral-950/10 rounded-lg">
          <i-magnifying-glass class="text-neutral-300"></i-magnifying-glass>

          <input
            type="text"
            placeholder="جستجوی شاگرد"
            class="w-full h-full text-xs md:text-sm text-neutral-700" />
        </div>

        <!-- add -->
        <v-btn
          variant="outlined"
          color="primary"
          @click="addPupilModal = true"
          class="px-2.5 md:px-3.5 h-8 md:h-10 flex flex-center hover:bg-primary/5 !rounded-lg transition-200">
          <i-plus-solid class="ml-1 text-sm text-primary"></i-plus-solid>
          <span class="text-xs md:text-sm text-primary">افزودن</span>
        </v-btn>
      </div>
    </div>

    <v-table class="w-full">
      <thead>
        <tr>
          <th>ردیف</th>
          <th>نام و نام خانوادگی</th>
          <th>نام کاربری</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in pupilsList" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ item.firstName }} {{ item.lastName }}</td>
          <td>{{ item.username }}</td>
          <td class="flex items-center justify-end">
            <div
              @click="pupilForDelete = item"
              class="size-9 hover:bg-red-500/10 flex flex-center rounded-full transition-200 cursor-pointer group">
              <i-trash-can-regular
                class="text-red-500/80 group-hover:text-red-500 transition-200"></i-trash-can-regular>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- <ul
      class="w-full flex flex-col items-start justify-start gap-0 rounded-xl overflow-hidden shadow">
      <li class="list-item">
        <p class="list-item-text">ردیف</p>
        <p class="list-item-text col-span-2">نام و نام خانوادگی</p>
        <p class="list-item-text col-span-2">شماره موبایل</p>
      </li>

      <span class="w-full h-[1px] bg-neutral-200"></span>

      <li :key="i" v-for="(item, i) in pupilsList" class="list-item">
        <p class="list-item-text">{{ i + 1 }}</p>
        <p class="list-item-text col-span-2">
          {{ item.firstName }} {{ item.lastName }}
        </p>
        <p class="list-item-text col-span-2">{{ item.mobile }}</p>

        <div class="flex items-center justify-end gap-2 col-span-7">
          <div
            @click="pupilForDelete = item"
            class="size-9 hover:bg-primary/10 flex flex-center rounded-full transition-200 cursor-pointer group">
            <i-trash-can-regular
              class="text-primary/60 group-hover:text-primary transition-200"></i-trash-can-regular>
          </div>
        </div>
      </li>
    </ul> -->

    <!-- add modal -->
    <app-modal v-if="addPupilModal" title="افزودن شاگرد" @close="closeAddModal">
      <div
        class="w-full h-full flex flex-col items-start justify-start gap-4 py-2">
        <p class="text-sm text-neutral-600">اطلاعات شاگرد جدید را وارد کنید</p>

        <div class="w-full flex flex-col items-start justify-start gap-2.5">
          <input
            type="text"
            placeholder="نام"
            v-model="pupil.firstName"
            class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

          <input
            type="text"
            v-model="pupil.lastName"
            placeholder="نام خانوادگی"
            class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />

          <input
            type="text"
            v-model="pupil.mobile"
            placeholder="شماره موبایل"
            class="w-full h-11 px-3 text-sm bg-inherit border border-neutral-950/15 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-lg transition-200" />
        </div>
      </div>

      <div class="w-full flex items-center justify-center gap-2">
        <button
          :disabled="!validPupil"
          class="w-full h-11 bg-primary flex flex-center rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
          <span class="text-sm text-white">ثبت</span>
        </button>

        <button
          @click="closeAddModal"
          class="w-full h-11 flex flex-center border border-primary rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
          <span class="text-sm text-primary">انصراف</span>
        </button>
      </div>
    </app-modal>

    <!-- delete modal -->
    <app-modal
      free-height
      v-if="pupilForDelete"
      title="حذف شاگرد"
      @close="closeDeleteModal">
      <p class="my-10 text-center text-neutral-600">
        آیا از حذف این
        <span class="font-bold">
          {{ pupilForDelete.firstName }} {{ pupilForDelete.lastName }}
        </span>
        مطمئن هستید؟
      </p>

      <div class="w-full flex items-center justify-center gap-2">
        <button
          class="w-full h-11 bg-primary flex flex-center rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
          <span class="text-sm text-white">حذف</span>
        </button>

        <button
          @click="closeDeleteModal"
          class="w-full h-11 flex flex-center border border-primary rounded-lg hover:brightness-90 disabled:brightness-75 transition-200">
          <span class="text-sm text-primary">انصراف</span>
        </button>
      </div>
    </app-modal>
  </article>
</template>

<script setup>
// variables
const pupil = ref({
  firstName: null,
  lastName: null,
  mobile: null,
});

// modals
const addPupilModal = ref(false);
const pupilForDelete = ref(null);

// data
const pupilsList = ref([
  {
    firstName: "John",
    lastName: "Doe",
    mobile: "09444567890",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mobile: "09445678901",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    mobile: "09446789012",
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    mobile: "09447890123",
  },
  {
    firstName: "Charlie",
    lastName: "Davis",
    mobile: "09448901234",
  },
  {
    firstName: "David",
    lastName: "Wilson",
    mobile: "09449012345",
  },
  {
    firstName: "Emily",
    lastName: "Miller",
    mobile: "09440123456",
  },
  {
    firstName: "Frank",
    lastName: "Moore",
    mobile: "09441234567",
  },
  {
    firstName: "Grace",
    lastName: "Taylor",
    mobile: "09442345678",
  },
  {
    firstName: "Hannah",
    lastName: "Anderson",
    mobile: "09443456789",
  },
]);

// computed
const validPupil = computed(() => {
  return pupil.value.firstName && pupil.value.lastName && pupil.value.mobile;
});

// methods
const closeAddModal = () => {
  pupil.value.firstName = null;
  pupil.value.lastName = null;
  pupil.value.mobile = null;
  addPupilModal.value = false;
};
const closeDeleteModal = () => {
  pupilForDelete.value = null;
};
</script>
