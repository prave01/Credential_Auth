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
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Inputs = {
  email: string;
  password: string;
};

const LoginCard = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<Inputs>();

  const {
    mutate,
    isPending,
    isError,
    error: qrError,
  } = useMutation({
    mutationFn: SigninFn,
  });

  const OnSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (res) => {
          // if (res?.request?.responseURL !== undefined) {
          //   const errorUrl = res.request.responseURL;
          //   if (String(errorUrl).includes("code")) {
          //     const error = String(errorUrl).toString().split("code=") || null;
          //     if (error !== undefined || error !== null) {
          //       return setError(String(error[1]).split("+").join(" "));
          //     }
          //   }
          // }
          console.log(res);
          router.push("/");
          toast.success("Login successfull");
        },
      },
    );
  };

  useEffect(() => {
    if (isError) {
      console.log("Login error:", qrError);
      toast.error(qrError?.message ?? "Something went wrong");
    }
  }, [isError, qrError]);

  return (
    <div>
      <Card className="relative flex flex-col items-center justify-center gap-y-4 rounded-md border-none bg-transparent sm:bg-neutral-800">
        <CardHeader className="w-full space-y-2">
          <CardTitle className="text-xl font-semibold text-white underline underline-offset-8">
            Login With Credentials
          </CardTitle>
          <CardDescription className="text-lg font-medium text-neutral-500">
            Login with email and password, this auth process is powered by{" "}
            <Link
              target="__blank"
              href="https://www.authjs.dev"
              className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-semibold text-transparent"
            >
              Auth.js
            </Link>
          </CardDescription>
        </CardHeader>
        <hr className="h-[1px] w-[100%] border border-zinc-700" />
        <CardContent className="w-full">
          <form
            onSubmit={handleSubmit(OnSubmit)}
            className="flex flex-col items-center space-y-4"
          >
            <label
              htmlFor={"email"}
              className="flex w-full flex-col gap-y-2 text-lg font-semibold text-orange-500"
            >
              {" "}
              Email
              <input
                {...register("email", { required: true })}
                id="email"
                type="email"
                placeholder="eg -- jhon.doe@xyz.com"
                className="h-10 max-h-10 w-full max-w-[100%] rounded-sm border-1 border-zinc-700 bg-zinc-800 pl-4 text-sm font-medium text-white placeholder:text-zinc-500 placeholder:italic focus:outline-2 focus:outline-zinc-500"
              />
            </label>
            <label className="flex w-full flex-col gap-y-2 text-lg font-semibold text-orange-500">
              {" "}
              Password
              <input
                {...register("password", { required: true })}
                id="password"
                type="password"
                placeholder="******"
                className="h-10 max-h-10 w-full max-w-[100%] rounded-sm border-1 border-zinc-700 bg-zinc-800 pl-4 text-sm font-medium text-white placeholder:text-zinc-500 placeholder:italic focus:outline-2 focus:outline-zinc-500"
              />
            </label>
            {error && error !== "undefined" && (
              <div className="mx-auto h-auto w-auto text-sm text-red-500">
                {error}
              </div>
            )}
            <CardAction className="mx-auto w-[80%]">
              {" "}
              <Button
                disabled={isPending}
                type="submit"
                className="text-md my-2 h-10 w-full cursor-pointer self-center bg-orange-500"
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
        <hr className="h-[1px] w-[100%] border border-zinc-700" />
        <CardFooter>
          <CardDescription className="text-md flex flex-col items-center gap-y-2 font-medium text-zinc-500">
            <span>
              Checkout{" "}
              <Link
                href={"https://thepraveen.vercel.app"}
                className="font-semibold text-orange-500 hover:text-neutral-200"
                target="_blank"
              >
                Praveen's portfolio
              </Link>
            </span>
            <span className="text-sm">
              Made with ❤️ By{" "}
              <Link
                href={"https://x.com/drunkidev"}
                className="font-semibold text-orange-500 italic hover:text-neutral-200"
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
