import { defineConfig } from "cypress";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// Load .env file
dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",  // Set your base URL here
    env: {
      MONGO_URI: process.env.MONGO_URI, // Ensure MONGO_URI is loaded
    },
    setupNodeEvents(on, config) {
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
