"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GetUserSession, SignoutFn } from "@/lib/queryFn";
import { BeatLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAxios } from "./hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const api = useAxios();

  const {
    isError,
    data: response,
    isPending,
    error,
  } = useQuery({
    queryFn: () => GetUserSession(api),
    queryKey: ["userSession"],
    enabled: !!api,
  });

  useEffect(() => {
    if (isError) {
      console.log("errror", error);
    }

    if (response) {
      setUser({
        name: response.data?.session?.user?.name,
        email: response.data?.session?.user?.email,
      });
    }
  }, [response, isError, error]);

  return (
    <div className="h-screen w-full bg-neutral-900">
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-y-4">
        {isPending || isError ? (
          <BeatLoader color="#ff0000" />
        ) : (
          <>
            <Button
              onClick={() => {
                SignoutFn();
                window.location.reload();
              }}
              className="absolute top-2 right-2 cursor-pointer border-1 border-zinc-700 text-lg font-semibold text-white hover:bg-orange-500 hover:text-black"
            >
              Sign out
            </Button>
            <div className="relative flex size-22 items-center justify-center rounded-full border-5 border-zinc-700 bg-pink-300 p-1 text-5xl font-bold text-black">
              {user?.name && user.name.split("")[0].toUpperCase()}
            </div>
            <Card className="w-fit border-1 border-zinc-700 bg-black">
              <CardContent className="flex flex-col items-start gap-y-4">
                <div className="flex items-center justify-center gap-x-2 text-lg font-semibold">
                  <div className="w-full max-w-40 rounded-md border-1 border-zinc-700 bg-zinc-800 px-4 text-orange-500">
                    User
                  </div>
                  <span className="text-amber-50">{user?.name}</span>
                </div>
                <div className="flex items-center justify-center gap-x-2 text-lg font-semibold">
                  <div className="w-full max-w-40 rounded-md border-1 border-zinc-700 bg-zinc-800 px-3 text-orange-500">
                    Email
                  </div>
                  <span className="text-amber-50">{user?.email}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
