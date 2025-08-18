import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import z from "zod";

export const clientTypeEnum = pgEnum("client_type_enum", ["confidential", "public"]);
export const applicationTypeEnum = pgEnum("application_type_enum", ["web", "native", "spa"]);
export const tokenEndpointAuthMethodEnum = pgEnum("token_endpoint_auth_method_enum", [
  "client_secret_basic",
  "client_secret_post",
  "client_secret_jwt",
  "none",
]);

export const clients = pgTable("oauth_clients", {
  // Primary identification
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  secret: varchar("client_secret"), // NULL for public clients
  name: varchar("client_name").unique().notNull(),

  // Client metadata
  clientType: clientTypeEnum("client_type").notNull(),
  applicationType: applicationTypeEnum("application_type").notNull(),

  // Authentication method for  token endpoint
  tokenEndpointAuthMethod: tokenEndpointAuthMethodEnum("token_endpoint_auth_method").default(
    "client_secret_basic",
  ),

  // Contact and metadata
  description: text("client_description"),
  uri: varchar("client_uri", { length: 500 }),
  logoURI: varchar("logo_uri", { length: 500 }),
  tosURI: varchar("tos_uri", { length: 500 }),
  policyURI: varchar("policy_uri", { length: 500 }),

  // Administrative
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => sql`now()`),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by"), // TODO: Should reference userId

  // Security settings
  requirePKCE: boolean("require_pkce").default(true), // Force PKCE for this client

  // Token lifetime (in seconds)
  accessTokenLifetime: integer("access_token_lifetime").default(3600), // 1 hour
  refreshTokenLifetime: integer("refresh_token_lifetime").default(2592000), // 30 days
  idTokenLifetime: integer("id_token_lifetime").default(3600), // 1 hour
  authorizationCodeLifetime: integer("authorization_code_lifetime").default(600), // 10 minutes
});

export const oauthScopes = pgTable("oauth_scopes", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("scope_name", { length: 100 }).unique().notNull(),
  description: text(),
  isDefault: boolean("is_default").default(false), // Automatically granted
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => sql`now()`),
});

export const clientRedirectURIs = pgTable(
  "client_redirect_uris",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    clientId: uuid("client_id")
      .references(() => clients.id, { onDelete: "cascade" })
      .notNull(),
    redirectURI: varchar("redirect_uri", { length: 2000 }).notNull(),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => sql`now()`),
  },
  (t) => [unique("unique_client_uri").on(t.clientId, t.redirectURI)],
);

export const clientScopes = pgTable(
  "client_scopes",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    clientId: uuid("client_id")
      .references(() => clients.id, { onDelete: "cascade" })
      .notNull(),
    scopeId: uuid("scope_id")
      .references(() => oauthScopes.id)
      .notNull(),
    grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow(),
    grantedBy: varchar("granted_by"),
  },
  (t) => [unique("unique_client_scope").on(t.clientId, t.scopeId)],
);

export const clientGrantTypes = pgTable(
  "client_grant_types",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    clientId: uuid("client_id")
      .references(() => clients.id, { onDelete: "cascade" })
      .notNull(),
    grantType: varchar("grant_type", { length: 50 }).notNull(), // authorization_code, refresh_token, client_credentials
  },
  (t) => [unique().on(t.clientId, t.grantType)],
);

export const clientRelations = relations(clients, ({ many }) => ({
  scopes: many(clientScopes),
  redirectURIs: many(clientRedirectURIs),
  grantTypes: many(clientGrantTypes),
}));

export const clientScopesRelations = relations(clientScopes, ({ one }) => ({
  client: one(clients, {
    fields: [clientScopes.clientId],
    references: [clients.id],
  }),
  scope: one(oauthScopes, {
    fields: [clientScopes.scopeId],
    references: [oauthScopes.id],
  }),
}));

export const clientRedirectURIsRelations = relations(clientRedirectURIs, ({ one }) => ({
  client: one(clients, {
    fields: [clientRedirectURIs.clientId],
    references: [clients.id],
  }),
}));

export const clientGrantTypesRelations = relations(clientGrantTypes, ({ one }) => ({
  client: one(clients, {
    fields: [clientGrantTypes.clientId],
    references: [clients.id],
  }),
}));

export const SelectClientSchema = createSelectSchema(clients);
export const InsertClientSchema = createInsertSchema(clients);
export const UpdateClientSchema = createUpdateSchema(clients);

export const SelectOAuthScopeSchema = createSelectSchema(oauthScopes);
export const InsertOAuthScopeSchema = createInsertSchema(oauthScopes);
export const UpdateOAuthScopeSchema = createUpdateSchema(oauthScopes);

export const SelectClientRedirectURISchema = createSelectSchema(clientRedirectURIs);
export const InsertClientRedirectURISchema = createInsertSchema(clientRedirectURIs, {
  redirectURI: z.url(),
});
export const UpdateClientRedirectURISchema = createUpdateSchema(clientRedirectURIs);

export const SelectClientScopeSchema = createSelectSchema(clientScopes);
export const InsertClientScopeSchema = createInsertSchema(clientScopes);
export const UpdateClientScopeSchema = createUpdateSchema(clientScopes);

export const SelectClientGrantTypeSchema = createSelectSchema(clientGrantTypes);
export const InsertClientGrantTypeSchema = createInsertSchema(clientGrantTypes);
export const UpdateClientGrantTypeSchema = createUpdateSchema(clientGrantTypes);

export const ClientDataSchema = z.object({
  client: InsertClientSchema.omit({ id: true, secret: true }),
  options: z
    .object({
      scopes: z.array(InsertClientScopeSchema.omit({ id: true, clientId: true })).optional(),
      redirectURIs: z.array(InsertClientRedirectURISchema.omit({ id: true, clientId: true })).optional(),
      grantTypes: z.array(InsertClientGrantTypeSchema.omit({ id: true, clientId: true })).optional(),
    })
    .optional(),
});
