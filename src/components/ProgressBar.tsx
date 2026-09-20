'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function ProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisible(true);
    setProgress(15);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    finishTimerRef.current = setTimeout(() => {
      setProgress(100);
      if (intervalRef.current) clearInterval(intervalRef.current);
      hideTimerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }, 400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="bg-gray-12 dark:bg-gray-11 fixed top-0 left-0 z-[9999] h-0.5 transition-all duration-200 ease-out"
      style={{ width: `${progress}%` }}
    />
  );
}

export default ProgressBar;
