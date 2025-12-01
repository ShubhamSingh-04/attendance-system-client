import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, theme as antdTheme, ThemeConfig } from 'antd';

type ThemeMode = 'dark';

type ThemeCtx = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeCtx>({
  mode: 'dark',
  setMode: () => {},
  toggle: () => {},
});
export const useThemeMode = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  // Keep a data attribute on <html> so CSS can react to theme changes.
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', mode);
    } catch (e) {}
  }, [mode]);

  const algorithms = useMemo(() => [antdTheme.darkAlgorithm], []);

  const config: ThemeConfig = useMemo(() => {
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
      boxShadowSecondary:
        '0 20px 60px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)',
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
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
      token: darkTokens,
      components: {
        Button: {
          primaryShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          borderRadius: 12,
          controlHeight: 44,
          fontWeight: 600,
        },
        Card: {
          borderRadius: 16,
          boxShadow:
            '0 10px 40px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
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
  }, [algorithms]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggle: () => setMode('dark'),
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={config}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
