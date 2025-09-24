"use client";

import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { SigninFn } from "@/lib/queryFn";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

const LoginCard = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<Inputs>();

  const { mutate, isPending } = useMutation({
    mutationFn: SigninFn,
  });

  const OnSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          if (res.request.responseURL !== undefined) {
            const errorUrl = res.request.responseURL;
            if (String(errorUrl).includes("code")) {
              const error = String(errorUrl).toString().split("code=") || null;
              if (error !== undefined || error !== null) {
                return setError(String(error[1]).split("+").join(" "));
              }
            }
            router.push("/");
          }
        },
        onError: (err) => {
          console.error(err);
          alert(err);
        },
      },
    );
  };

  return (
    <div>
      <Card className="sm:bg-neutral-800 rounded-md relative bg-transparent flex flex-col gap-y-4 items-center justify-center border-none">
        <CardHeader className="w-full space-y-2">
          <CardTitle className="text-xl text-white underline underline-offset-8 font-semibold">
            Login With Credentials
          </CardTitle>
          <CardDescription className="text-lg font-medium text-neutral-500">
            Login with email and password, this auth process is powered by{" "}
            <Link
              target="__blank"
              href="https://www.authjs.dev"
              className="bg-gradient-to-r font-semibold from-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              Auth.js
            </Link>
          </CardDescription>
        </CardHeader>
        <hr className="h-[1px] w-[100%] border border-[0.2px] border-zinc-700" />
        <CardContent className="w-full ">
          <form
            onSubmit={handleSubmit(OnSubmit)}
            className="space-y-4 flex items-center flex-col"
          >
            <label
              htmlFor={"email"}
              className="flex gap-y-2 text-orange-500 w-full font-semibold text-lg flex-col"
            >
              {" "}
              Email
              <input
                {...register("email", { required: true })}
                id="email"
                type="email"
                placeholder="eg -- jhon.doe@xyz.com"
                className="max-w-[100%] focus:outline-2 text-sm font-medium placeholder:italic text-white pl-4 focus:outline-zinc-500 placeholder:text-zinc-500  w-full bg-zinc-800 border-1 max-h-10 h-10  border-zinc-700 rounded-sm "
              />
            </label>
            <label className="flex gap-y-2 text-orange-500 w-full font-semibold text-lg flex-col">
              {" "}
              Password
              <input
                {...register("password", { required: true })}
                id="password"
                type="password"
                placeholder="******"
                className="max-w-[100%] focus:outline-2 text-sm font-medium placeholder:italic text-white pl-4 focus:outline-zinc-500 placeholder:text-zinc-500  w-full bg-zinc-800 border-1 max-h-10 h-10  border-zinc-700 rounded-sm "
              />
            </label>
            {error && error !== "undefined" && (
              <div className="w-auto text-red-500 mx-auto text-sm h-auto">
                {error}
              </div>
            )}
            <CardAction className="w-[80%] mx-auto">
              {" "}
              <Button
                disabled={isPending}
                type="submit"
                className="w-full self-center my-2 text-md cursor-pointer bg-orange-500 h-10"
              >
                {isPending ? (
                  <PulseLoader size={10} color="#e63f3f" className="" />
                ) : (
                  "Submit"
                )}
              </Button>
            </CardAction>
          </form>
        </CardContent>
        <hr className="h-[1px] w-[100%] border border-[0.2px] border-zinc-700" />
        <CardFooter>
          <CardDescription className="text-md flex flex-col gap-y-2 items-center text-zinc-500 font-medium">
            <span>
              Checkout{" "}
              <Link
                href={"https://thepraveen.vercel.app"}
                className="text-orange-500 hover:text-neutral-200 font-semibold"
                target="_blank"
              >
                Praveen's portfolio
              </Link>
            </span>
            <span className="text-sm">
              Made with ❤️ By{" "}
              <Link
                href={"https://x.com/drunkidev"}
                className="italic hover:text-neutral-200 text-orange-500 font-semibold"
                target="_blank"
              >
                _Praveen_
              </Link>
            </span>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginCard;
