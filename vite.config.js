import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// https://vitejs.dev/config/#conditional-config
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),

      VitePWA({
        injectRegister: "auto",
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: "SunnySideUp",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // When deploying to Github pages, the base URL will be your repo's name,
    // Thus the production base URL must be changed here for it to work when deployed.
    // Ref: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#next-steps
    base: mode === "github-pages" ? "/SunnySideUp/" : "/",
  };
});
