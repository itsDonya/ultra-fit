// plugins/viewer.client.ts
import { defineNuxtPlugin } from "#app";
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Viewer);
});
