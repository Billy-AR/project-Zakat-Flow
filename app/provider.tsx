"use client";

import { ThemeProvider } from "./themeProvider";
import { ThemeAwareToast } from "./ThemeAwareToast";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <ThemeAwareToast />
    </ThemeProvider>
  );
}

export default Provider;
