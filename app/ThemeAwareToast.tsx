"use client";

import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

export function ThemeAwareToast() {
  const { resolvedTheme } = useTheme();

  return <ToastContainer closeOnClick theme={resolvedTheme === "dark" ? "dark" : "light"} position="bottom-right" />;
}
