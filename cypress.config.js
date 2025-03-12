import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Set your base URL here
    setupNodeEvents(on, config) {
      require('cypress-mongodb')(on);
      return config;
    },
  },
});
