import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const mds = "https://mds3.fidoalliance.org";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: mds,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
