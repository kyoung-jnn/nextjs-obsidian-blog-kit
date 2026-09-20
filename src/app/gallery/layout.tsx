import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-x-1.5 gap-y-3 p-2">
      {children}
    </section>
  );
}
