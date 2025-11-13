/// <reference types="node" />

import { defineConfig, loadEnv } from "vite";
import photoOgPagesPlugin from "./scripts/photo-og-pages-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = env.SITE_URL ?? "https://emz.im";

  return {
    plugins: [
      photoOgPagesPlugin({
        siteUrl,
      }),
    ],
    build: {
      manifest: true,
      rollupOptions: {
        input: {
          main: "index.html",
          photos: "photos.html",
          blog: "blog.html",
          404: "404.html",
        },
      },
    },
  };
});
