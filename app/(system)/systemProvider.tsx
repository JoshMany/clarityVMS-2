"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" storageKey="theme" defaultTheme="system">
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
