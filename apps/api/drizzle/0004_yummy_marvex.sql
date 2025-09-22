ALTER TABLE "auth_users" ALTER COLUMN "password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "auth_users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "auth_users" DROP COLUMN "email_verified";--> statement-breakpoint
ALTER TABLE "auth_users" DROP COLUMN "firstName";--> statement-breakpoint
ALTER TABLE "auth_users" DROP COLUMN "lastName";