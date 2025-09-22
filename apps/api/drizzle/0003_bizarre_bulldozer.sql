ALTER TABLE "auth_users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "auth_users" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;