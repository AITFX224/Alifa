import { useEffect, useState } from "react";

export type AccountMode = 'user' | 'artisan';

const STORAGE_KEY = 'account_mode';

export const useAccountMode = () => {
  const [mode, setMode] = useState<AccountMode>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return (saved === 'artisan' || saved === 'user') ? saved : 'user';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  }, [mode]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'artisan' || e.newValue === 'user')) {
        setMode(e.newValue as AccountMode);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isArtisanMode = mode === 'artisan';

  return { mode, setMode, isArtisanMode };
};