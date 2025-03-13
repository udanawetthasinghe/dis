import { defineConfig } from "cypress";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { allureCypress } from "allure-cypress/reporter";


// Load .env file
dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    env: {
      MONGO_URI: process.env.MONGO_URI,
    },
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
      });
      on("task", {
        async deleteTestUsers() {
          if (!config.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined. Check your .env file.");
          }

          const client = new MongoClient(config.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
          await client.connect();
          const db = client.db("prodms"); // Replace with your actual DB name
          const result = await db.collection("users").deleteMany({ name: /^Cypress/ });
          await client.close();
          return result.deletedCount;
        },
      });

      return config;
    },
  },
});
