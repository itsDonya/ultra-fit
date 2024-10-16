import { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  css: ["~/assets/style/main.scss"],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "UltraFit | اولترا فیت",
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  plugins: ["~/plugins/axios.js", "~/plugins/toastification.js"],
  modules: ["nuxt-svgo"],
  svgo: {
    autoImportPath: "./assets/svg/",
    componentPrefix: "i",
  },
  runtimeConfig: {
    public: {
      baseUrl:
        process.env.NUXT_PUBLIC_BASE_URL || "http://192.168.20.236:5000/api/",
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  build: {
    transpile: ["vuetify"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  aos: {
    duration: 1400,
    once: true,
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
