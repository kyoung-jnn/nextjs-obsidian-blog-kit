import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <section className="relative mx-auto mt-[60px] max-w-[664px]">{children}</section>;
}
