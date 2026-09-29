import { defineConfig } from "@tnldotdev/tnl/config";

export default defineConfig({
  services: {
    app: {
      directory: ".",
      dev: { command: ["next", "dev"] },
    },
  },
});
