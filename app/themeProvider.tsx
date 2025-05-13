"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <ToastContainer
        closeOnClick
        // Use a client component to determine theme after hydration
        theme="light"
        position="bottom-right"
      />
    </NextThemesProvider>
  );
}
