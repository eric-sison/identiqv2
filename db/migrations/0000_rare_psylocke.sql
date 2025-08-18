CREATE TYPE "public"."application_type_enum" AS ENUM('web', 'native', 'spa');--> statement-breakpoint
CREATE TYPE "public"."client_type_enum" AS ENUM('confidential', 'public');--> statement-breakpoint
CREATE TYPE "public"."token_endpoint_auth_method_enum" AS ENUM('client_secret_basic', 'client_secret_post', 'client_secret_jwt', 'none');--> statement-breakpoint
CREATE TABLE "client_grant_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" uuid NOT NULL,
	"grant_type" varchar(50) NOT NULL,
	CONSTRAINT "client_grant_types_client_id_grant_type_unique" UNIQUE("client_id","grant_type")
);
--> statement-breakpoint
CREATE TABLE "client_redirect_uris" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" uuid NOT NULL,
	"redirect_uri" varchar(2000) NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_client_uri" UNIQUE("client_id","redirect_uri")
);
--> statement-breakpoint
CREATE TABLE "client_scopes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" uuid NOT NULL,
	"scope_id" uuid NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now(),
	"granted_by" varchar,
	CONSTRAINT "unique_client_scope" UNIQUE("client_id","scope_id")
);
--> statement-breakpoint
CREATE TABLE "oauth_clients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_secret" varchar,
	"client_name" varchar NOT NULL,
	"client_type" "client_type_enum" NOT NULL,
	"application_type" "application_type_enum" NOT NULL,
	"token_endpoint_auth_method" "token_endpoint_auth_method_enum" DEFAULT 'client_secret_basic',
	"client_description" text,
	"client_uri" varchar(500),
	"logo_uri" varchar(500),
	"tos_uri" varchar(500),
	"policy_uri" varchar(500),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"require_pkce" boolean DEFAULT true,
	"access_token_lifetime" integer DEFAULT 3600,
	"refresh_token_lifetime" integer DEFAULT 2592000,
	"id_token_lifetime" integer DEFAULT 3600,
	"authorization_code_lifetime" integer DEFAULT 600,
	CONSTRAINT "oauth_clients_client_name_unique" UNIQUE("client_name")
);
--> statement-breakpoint
CREATE TABLE "oauth_scopes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"scope_name" varchar(100) NOT NULL,
	"description" text,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "oauth_scopes_scope_name_unique" UNIQUE("scope_name")
);
--> statement-breakpoint
ALTER TABLE "client_grant_types" ADD CONSTRAINT "client_grant_types_client_id_oauth_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."oauth_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_redirect_uris" ADD CONSTRAINT "client_redirect_uris_client_id_oauth_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."oauth_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_scopes" ADD CONSTRAINT "client_scopes_client_id_oauth_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."oauth_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_scopes" ADD CONSTRAINT "client_scopes_scope_id_oauth_scopes_id_fk" FOREIGN KEY ("scope_id") REFERENCES "public"."oauth_scopes"("id") ON DELETE no action ON UPDATE no action;