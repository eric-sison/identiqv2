import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schemas/*.ts",
  out: "./db/migrations",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "myuser",
    password: "mypassword",
    database: "mydb",
    ssl: false,
  },
});
