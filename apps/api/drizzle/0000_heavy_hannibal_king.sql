CREATE TABLE "users" (
	"Id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"FirstName" varchar(254) NOT NULL,
	"LastName" varchar(254),
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
