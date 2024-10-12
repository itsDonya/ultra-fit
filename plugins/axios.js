import axios from "axios";
// import { errorPersianMessage } from "../utils/errors";

export default defineNuxtPlugin((nuxtApp) => {
  // Set baseURL of axios instance
  axios.defaults.baseURL = nuxtApp.$config.public.baseUrl;

  // Add axios instance to Vue prototype
  nuxtApp.$config.$axios = axios;
  nuxtApp.provide("axios", axios);

  // Config axios interceptors
  // axios.interceptors.request.use(
  //   function (config) {
  //     // Set Authorization Token as Header
  //     const AUTH_TOKEN = useCookie("TulipsTOKEN").value || "";
  //     if (AUTH_TOKEN) {
  //       config.headers["Authorization"] = "Bearer " + AUTH_TOKEN;
  //     }

  //     // Do something before request is sent
  //     return config;
  //   },
  //   function (error) {
  //     // Do something with request error
  //     return Promise.reject(error);
  //   }
  // );

  // Config axios interceptors
  axios.interceptors.response.use(
    (response) => {
      console.log("response: ", response);
      return response;
    },
    function (error) {
      if (error?.message == "Network Error") {
        nuxtApp.$toast.error("خطا در اتصال به شبکه");
      }

      Promise.reject(error);
    }
  );
});
