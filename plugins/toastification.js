import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useToast } from "vue-toastification";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const options = {
      rtl: true,
      icon: false,
      position: "top-center",
      hideProgressBar: false,
      transition: "Vue-Toastification__fade",
    };

    nuxtApp.vueApp.use(Toast, options);
    nuxtApp.provide("toast", useToast());
  }
});
