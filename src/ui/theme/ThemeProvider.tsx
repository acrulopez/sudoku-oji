import React, { createContext, useContext, useMemo } from 'react';
import { useSettingsStore } from '../../state/settingsStore';
import { getTheme, type Theme } from './themes';

const ThemeContext = createContext<Theme>(getTheme(''));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeKey = useSettingsStore((s) => s.themeKey);
  const theme = useMemo(() => getTheme(themeKey), [themeKey]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
