import { Pool } from "pg";
import { createEnv } from "../utils/helpers";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schemas/client";

const env = createEnv();

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  ssl: false,
});

const db = drizzle({
  client: pool,
  logger: true,
  schema,
});

export default db;
