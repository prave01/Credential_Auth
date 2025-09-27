"use client";

import LoginCard from "@/components/auth/login";
import SignUpCard from "@/components/auth/signup";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();

  const target = searchParams.get("target");

  const [whichDiv, setWhichDiv] = useState<string>(
    target?.toString() || "signup",
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-y-10">
      <div className="flex h-10 w-auto items-center justify-center gap-x-4 rounded-md bg-black px-3 py-2">
        <motion.div className="flex gap-2">
          <motion.div
            onClick={() => setWhichDiv("signup")}
            className={cn(
              "relative cursor-pointer rounded px-3 py-2 font-semibold text-orange-500",
            )}
          >
            <span className="relative z-10">Signup</span>

            {whichDiv === "signup" && (
              <motion.div
                layoutId="change"
                className={cn(
                  "absolute inset-0 h-full w-full",
                  "bg-neutral-800",
                )}
              ></motion.div>
            )}
          </motion.div>

          <motion.div
            onClick={() => setWhichDiv("login")}
            className={cn(
              "relative cursor-pointer rounded px-3 py-2 font-semibold text-orange-500",
            )}
          >
            <span className="relative z-10">Login</span>
            {whichDiv === "login" && (
              <motion.div
                layoutId="change"
                className={cn(
                  "absolute inset-0 h-full w-full",
                  "bg-neutral-800",
                )}
              ></motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="h-full min-h-[680px] w-full max-w-lg">
        {whichDiv === "signup" ? (
          <SignUpCard onSignupSuccess={setWhichDiv} />
        ) : (
          <LoginCard />
        )}
      </div>
    </div>
  );
}
