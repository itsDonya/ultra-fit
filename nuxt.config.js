import { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  css: ["~/assets/style/main.scss"],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "UltraFit | شاگرد من",
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  plugins: [
    "~/plugins/mitt.js",
    "~/plugins/axios.js",
    "~/plugins/viewer.client.js",
    "~/plugins/toastification.js",
  ],
  modules: ["nuxt-svgo"],
  svgo: {
    autoImportPath: "./assets/svg/",
    componentPrefix: "i",
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      imageCdn: process.env.NUXT_PUBLIC_FILE_URL,
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
