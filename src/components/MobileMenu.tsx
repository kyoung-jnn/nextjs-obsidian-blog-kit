'use client';

import Link from 'next/link';
import { type MouseEvent, useEffect, useState } from 'react';

import IconButton from '@/components/IconButton';
import { MENU_LIST } from '@/config';

function MobileMenu() {
  const [hasNav, setHasNav] = useState(false);

  useEffect(() => {
    if (hasNav) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [hasNav]);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setHasNav((prev) => !prev);
  };

  return (
    <div className="tablet:hidden block">
      <IconButton name="Menu" aria-label="Toggle Menu Button" onClick={handleClick} />

      {hasNav && (
        <div className="fixed top-0 left-0 z-[100] animate-[fade-left_0.5s_ease-in-out]">
          <div className="bg-gray-5 dark:bg-gray-2 absolute top-0 left-0 h-dvh w-dvw opacity-80" />
          <section
            className="absolute z-10 flex h-dvh w-dvw flex-col items-center justify-center"
            onClick={handleClick}
          >
            {MENU_LIST.map(({ name, href }) => (
              <Link key={name} href={href}>
                <button className="text-gray-12 dark:text-gray-12 w-full cursor-pointer p-8 text-center text-2xl font-bold">
                  {name}
                </button>
              </Link>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
