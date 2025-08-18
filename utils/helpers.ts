import db from "@/db/connection";
import { EnvSchema } from "../lib/validators/common";
import { clsx, type ClassValue } from "clsx";
import { randomBytes } from "crypto";
import { count, DrizzleTypeError, SQL, Subquery } from "drizzle-orm";
import { PgTable, TableLikeHasEmptySelection } from "drizzle-orm/pg-core";
import { PgViewBase } from "drizzle-orm/pg-core/view-base";
import { twMerge } from "tailwind-merge";
import z, { type ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createEnv = () => {
  try {
    // Validate process.env against schema
    return EnvSchema.parse(process.env);
  } catch (error) {
    const zodError = error as ZodError;

    // Print a structured error for easier debugging
    console.error(z.treeifyError(zodError));

    // Exit the application if env is invalid
    process.exit(1);
  }
};

export const isValidUrl = (str: string) => {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const generateClientSecret = (length?: number): string => {
  return randomBytes(length ?? 32).toString("hex");
};

export const paginate = async <TFrom extends PgTable | Subquery | PgViewBase | SQL>(
  source: TableLikeHasEmptySelection<TFrom> extends true
    ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause">
    : TFrom,
  page?: number,
  limit?: number,
) => {
  try {
    return await db.transaction(async (tx) => {
      limit = limit ?? 10;
      page = page ?? 1;
      const offset = (page - 1) * limit;

      const total = await db.select({ count: count() }).from(source);
      const data = await db.select().from(source).limit(limit).offset(offset);

      return {
        data,
        metadata: {
          itemsPerPage: limit,
          totalItems: total[0].count,
          currentPage: page,
          totalPages: Math.ceil(Number(total[0].count) / limit),
        },
      };
    });
  } catch (error) {
    throw error;
  }
};
