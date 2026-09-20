'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

import MobileMenu from '@/components/MobileMenu';
import ThemeSwitch from '@/components/ThemeSwitch';
import { SITE_CONFIG } from '@/config';

function Header() {
  const pathname = usePathname();

  return (
    <header className="dark:text-gray-12 sticky top-0 z-[100] h-[44px] backdrop-blur-[3px]">
      <nav className="mx-auto flex max-w-[664px] items-center justify-between px-[12px] py-[10px]">
        <Link href="/" aria-label="home link">
          <p className="flex items-center justify-between text-[14px] font-normal">
            {pathname !== '/' && SITE_CONFIG.author.enName}
          </p>
        </Link>
        <div className="flex items-center gap-[6px] text-[16px] font-semibold">
          <ThemeSwitch />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

export default memo(Header);
