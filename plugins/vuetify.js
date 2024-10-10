// ----------------------------------------------------------------------------------------
// ------------------------------- Vuetify config start -----------------------------------
// ----------------------------------------------------------------------------------------

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { fa } from "vuetify/locale";

// Custom theme properties
const lightTheme = {
  dark: false,
  colors: {
    primary: "#080369",
    secondary: "#4e97fc",
    light: "#a4d8fc",
    dark: "#1d1d1d",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    locale: {
      locale: "fa",
      fallback: "fa",
      messages: { fa },
      rtl: { fa: true },
    },
    theme: {
      defaultTheme: "lightTheme",
      options: {
        customProperties: true,
      },
      themes: {
        lightTheme,
      },
    },
    components,
    directives,
  });
  nuxtApp.vueApp.use(vuetify);
  if (process.client) {
  }
});

// ----------------------------------------------------------------------------------------
// ------------------------------- Vuetify config end -------------------------------------
// ----------------------------------------------------------------------------------------
