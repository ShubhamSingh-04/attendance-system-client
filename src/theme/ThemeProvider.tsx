import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, theme as antdTheme, ThemeConfig } from 'antd';

type ThemeMode = 'light' | 'dark';

type ThemeCtx = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeCtx>({
  mode: 'light',
  setMode: () => {},
  toggle: () => {},
});
export const useThemeMode = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemPrefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [mode, setMode] = useState<ThemeMode>(
    () =>
      (localStorage.getItem('theme') as ThemeMode) ||
      (systemPrefersDark ? 'dark' : 'light')
  );

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  // Keep a data attribute on <html> so CSS can react to theme changes.
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', mode);
    } catch (e) {}
  }, [mode]);

  const algorithms = useMemo(
    () =>
      mode === 'dark'
        ? [antdTheme.darkAlgorithm]
        : [antdTheme.defaultAlgorithm],
    [mode]
  );

  const config: ThemeConfig = useMemo(() => {
    const lightTokens = {
      colorPrimary: '#2563eb',
      borderRadius: 10,
      colorBgBase: '#f6f8fb',
      colorText: '#0f172a',
      colorBgContainer: '#ffffff',
      colorBorder: '#e6eef6',
      colorTextSecondary: '#6b7280',
      boxShadow: '0 6px 18px rgba(16, 24, 40, 0.06)',
    } as any;

    const darkTokens = {
      colorPrimary: '#2563eb',
      borderRadius: 10,
      colorBgBase: '#071427',
      colorText: '#e6eef8',
      colorBgContainer: '#0b1724',
      colorBorder: '#15232f',
      colorTextSecondary: '#94a3b8',
      boxShadow: 'none',
    } as any;

    return {
      algorithm: algorithms,
      token: mode === 'dark' ? darkTokens : lightTokens,
    };
  }, [algorithms, mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={config}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
