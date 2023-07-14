import { useTheme } from 'next-themes';

export function useIsDarkMode() {
  const { resolvedTheme } = useTheme();

  return {
    isDarkMode: resolvedTheme === 'dark',
  };
}
