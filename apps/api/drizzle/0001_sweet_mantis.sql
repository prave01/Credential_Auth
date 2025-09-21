ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "Age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "Email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_Email_unique" UNIQUE("Email");