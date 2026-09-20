'use client';

import { ThemeProvider as _ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <_ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      {children}
    </_ThemeProvider>
  );
}

export default ThemeProvider;
