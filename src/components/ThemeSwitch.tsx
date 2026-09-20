'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import Icon from '@/components/Icon';

export const THEME = {
  light: 'light',
  dark: 'dark',
} as const;

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleClick = () => {
    setTheme(theme === THEME.dark ? THEME.light : THEME.dark);
  };

  return (
    <button className="h-[24px] w-[24px] cursor-pointer" onClick={handleClick}>
      {!mounted ? (
        <Image
          alt="theme-placeholder"
          src={'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
          width={40}
          height={40}
        />
      ) : theme === THEME.light ? (
        <Icon name="Sun" className="animate-[rotate-sun_1s]" />
      ) : (
        <Icon name="Moon" className="animate-[rotate-moon_1s]" />
      )}
    </button>
  );
};

export default ThemeSwitch;
