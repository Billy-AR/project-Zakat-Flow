"use client";

import { ThemeProvider } from "./themeProvider";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableColorScheme disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

export default Provider;
