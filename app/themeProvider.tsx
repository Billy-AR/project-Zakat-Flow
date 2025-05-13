"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <ToastContainer closeOnClick theme={resolvedTheme === "dark" ? "dark" : "light"} position="bottom-right" />
      <NextThemesProvider {...props}>{children}</NextThemesProvider>;
    </>
  );
}
