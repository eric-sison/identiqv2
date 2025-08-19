CREATE TABLE "client_response_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"response_type" varchar(50) NOT NULL,
	CONSTRAINT "unique_client_id_response_type" UNIQUE("client_id","response_type")
);
--> statement-breakpoint
ALTER TABLE "client_grant_types" DROP CONSTRAINT "client_grant_types_client_id_grant_type_unique";--> statement-breakpoint
ALTER TABLE "client_scopes" DROP CONSTRAINT "unique_client_scope";--> statement-breakpoint
ALTER TABLE "client_response_types" ADD CONSTRAINT "client_response_types_client_id_oauth_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."oauth_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_grant_types" ADD CONSTRAINT "unique_client_id_grant_type" UNIQUE("client_id","grant_type");--> statement-breakpoint
ALTER TABLE "client_scopes" ADD CONSTRAINT "unique_client_id_scope" UNIQUE("client_id","scope_id");