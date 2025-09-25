"use client";

import { useRouter } from "next/navigation";
import api, { attachInterceptor } from "../lib/api";
import { useEffect } from "react";

export const useAxios = () => {
  const router = useRouter();

  useEffect(() => {
    attachInterceptor(router);
  }, [router]);

  return api;
};
