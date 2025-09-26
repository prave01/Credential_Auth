"use client";

import { useRouter } from "next/navigation";
import api, { attachInterceptor } from "../lib/api";

export const useAxios = () => {
  const router = useRouter();

  attachInterceptor(router);

  return api;
};
