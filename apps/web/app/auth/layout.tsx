"use client";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-neutral-900">{children}</div>;
};

export default Layout;
