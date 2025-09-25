"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { GetUserSession, SignoutFn } from "@/lib/queryFn";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAxios } from "./hooks/useAxios";

export default function Home() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const router = useRouter();

  const api = useAxios();

  const {
    isError,
    error,
    data: response,
    isLoading,
  } = useQuery({
    queryKey: ["session"],
    queryFn: GetUserSession,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/protected");
        setUser({
          name: response.data?.session?.user?.name,
          email: response.data?.session?.user?.email,
        });
      } catch (err: any) {
        console.log(err.message);
        toast.error("Unauthorized, please login");
      }
    };
    fetchData();
  }, [api]);

  return (
    <div className="bg-neutral-900 h-screen w-full">
      <div className="max-w-xl flex-col gap-y-4 flex items-center mx-auto justify-center h-full">
        {isLoading || isError ? (
          <BeatLoader color="#ff0000" />
        ) : (
          <>
            <Button
              onClick={() => {
                SignoutFn();
                window.location.reload();
              }}
              className="text-white hover:bg-orange-500 cursor-pointer hover:text-black font-semibold absolute border-zinc-700 border-1 text-lg top-2 right-2"
            >
              Sign out
            </Button>
            <div className="size-22 rounded-full relative flex items-center justify-center text-5xl font-bold p-1 bg-pink-300 text-black border-zinc-700 border-5">
              {user?.name && user.name.split("")[0].toUpperCase()}
            </div>
            <Card className=" border-zinc-700 bg-black border-1 w-fit">
              <CardContent className="flex items-start flex-col gap-y-4">
                <div className="flex gap-x-2 items-center text-lg font-semibold justify-center">
                  <div className="border-1 max-w-40 w-full text-orange-500  px-4 border-zinc-700 bg-zinc-800 rounded-md">
                    User
                  </div>
                  <span className="text-amber-50">{user?.name}</span>
                </div>
                <div className="flex gap-x-2 items-center text-lg font-semibold justify-center">
                  <div className="border-1 text-orange-500  max-w-40 w-full px-3 border-zinc-700 bg-zinc-800 rounded-md">
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
