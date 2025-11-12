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
      colorPrimary: '#6366f1',
      colorPrimaryHover: '#4f46e5',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#14b8a6',
      borderRadius: 16,
      borderRadiusLG: 20,
      borderRadiusSM: 12,
      colorBgBase: '#f8fafc',
      colorText: '#0f172a',
      colorTextSecondary: '#475569',
      colorBgContainer: '#ffffff',
      colorBorder: '#e2e8f0',
      colorBorderSecondary: '#cbd5e1',
      boxShadow: '0 10px 40px rgba(99, 102, 241, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
      boxShadowSecondary: '0 20px 60px rgba(99, 102, 241, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      fontSize: 14,
      fontSizeHeading1: 32,
      fontSizeHeading2: 26,
      fontSizeHeading3: 22,
      lineHeight: 1.6,
      motion: true,
      motionUnit: 0.1,
      motionBase: 0,
    } as any;

    const darkTokens = {
      colorPrimary: '#818cf8',
      colorPrimaryHover: '#6366f1',
      colorSuccess: '#34d399',
      colorWarning: '#fbbf24',
      colorError: '#f87171',
      colorInfo: '#2dd4bf',
      borderRadius: 16,
      borderRadiusLG: 20,
      borderRadiusSM: 12,
      colorBgBase: '#0f172a',
      colorText: '#f1f5f9',
      colorTextSecondary: '#cbd5e1',
      colorBgContainer: '#1e293b',
      colorBorder: '#334155',
      colorBorderSecondary: '#475569',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
      boxShadowSecondary: '0 20px 60px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      fontSize: 14,
      fontSizeHeading1: 32,
      fontSizeHeading2: 26,
      fontSizeHeading3: 22,
      lineHeight: 1.6,
      motion: true,
      motionUnit: 0.1,
      motionBase: 0,
    } as any;

    return {
      algorithm: algorithms,
      token: mode === 'dark' ? darkTokens : lightTokens,
      components: {
        Button: {
          primaryShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          borderRadius: 12,
          controlHeight: 44,
          fontWeight: 600,
        },
        Card: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 10px 40px rgba(99, 102, 241, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
            : '0 10px 40px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
        },
        Input: {
          borderRadius: 12,
          controlHeight: 44,
        },
        Select: {
          borderRadius: 12,
          controlHeight: 44,
        },
        Modal: {
          borderRadius: 20,
        },
        Table: {
          borderRadius: 16,
        },
      },
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
