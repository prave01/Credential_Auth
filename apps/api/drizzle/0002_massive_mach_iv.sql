CREATE TABLE "auth_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"firstName" varchar(254),
	"lastName" varchar(254),
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;