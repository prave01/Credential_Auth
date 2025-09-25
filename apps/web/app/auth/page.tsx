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
    <div className=" min-h-screen mx-auto flex flex-col gap-y-10 items-center justify-center max-w-2xl w-full">
      <div className="w-auto rounded-md px-3 py-2 bg-black flex items-center justify-center gap-x-4 h-10">
        <motion.div className="flex gap-2">
          <motion.div
            onClick={() => setWhichDiv("signup")}
            className={cn(
              "px-3 py-2 relative cursor-pointer text-orange-500 font-semibold rounded",
            )}
          >
            <span className="relative z-10">Signup</span>

            {whichDiv === "signup" && (
              <motion.div
                layoutId="change"
                className={cn(
                  "absolute w-full h-full inset-0",
                  "bg-neutral-800",
                )}
              ></motion.div>
            )}
          </motion.div>

          <motion.div
            onClick={() => setWhichDiv("login")}
            className={cn(
              "px-3 py-2 relative cursor-pointer  text-orange-500 font-semibold rounded",
            )}
          >
            <span className="relative z-10">Login</span>
            {whichDiv === "login" && (
              <motion.div
                layoutId="change"
                className={cn(
                  "absolute w-full h-full inset-0 ",
                  "bg-neutral-800",
                )}
              ></motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-lg min-h-[680px] w-full h-full">
        {whichDiv === "signup" ? (
          <SignUpCard onSignupSuccess={setWhichDiv} />
        ) : (
          <LoginCard />
        )}
      </div>
    </div>
  );
}
