/**
 * Color palettes for the app. The theme palette feature lets the player pick
 * one; the selected key is persisted in the settings store.
 */

export interface Theme {
  key: string;
  name: string;
  dark: boolean;
  colors: {
    background: string;
    surface: string;
    /** App + section text. */
    text: string;
    textMuted: string;
    /** Accent used for selection, active tools, given highlights. */
    primary: string;
    /** Subtle tint for the selected cell's row/column/box. */
    highlight: string;
    /** Tint for cells sharing the selected value. */
    sameValue: string;
    /** Selected cell background. */
    selected: string;
    /** Player-entered (non-given) digit color. */
    userValue: string;
    /** Conflicting / mistaken cell. */
    error: string;
    /** Grid lines. */
    gridLine: string;
    gridLineBold: string;
    /** Pencil-note color. */
    note: string;
  };
}

const light: Theme = {
  key: 'light',
  name: 'Classic Light',
  dark: false,
  colors: {
    background: '#F2F3F7',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#8A8F98',
    primary: '#2F6BFF',
    highlight: '#E8EBF2',
    sameValue: '#D5DEF7',
    selected: '#2F6BFF',
    userValue: '#2F6BFF',
    error: '#E5484D',
    gridLine: '#D3D6DE',
    gridLineBold: '#6B7280',
    note: '#6B7280',
  },
};

const dark: Theme = {
  key: 'dark',
  name: 'Midnight',
  dark: true,
  colors: {
    background: '#0E1116',
    surface: '#171B22',
    text: '#F2F3F7',
    textMuted: '#8A8F98',
    primary: '#5B8CFF',
    highlight: '#1E2530',
    sameValue: '#26344F',
    selected: '#3B6FE0',
    userValue: '#7FA6FF',
    error: '#FF6B6E',
    gridLine: '#2A2F3A',
    gridLineBold: '#4A515E',
    note: '#9AA1AD',
  },
};

const forest: Theme = {
  key: 'forest',
  name: 'Forest',
  dark: false,
  colors: {
    background: '#F1F5F0',
    surface: '#FFFFFF',
    text: '#1C2B1E',
    textMuted: '#7C8A7E',
    primary: '#2E7D4F',
    highlight: '#E4EEE4',
    sameValue: '#CDE6D2',
    selected: '#2E7D4F',
    userValue: '#2E7D4F',
    error: '#D9534F',
    gridLine: '#CDD8CC',
    gridLineBold: '#5E6E60',
    note: '#6E7D70',
  },
};

const sunset: Theme = {
  key: 'sunset',
  name: 'Sunset',
  dark: false,
  colors: {
    background: '#FFF4ED',
    surface: '#FFFFFF',
    text: '#3A2417',
    textMuted: '#A38B7C',
    primary: '#E8703A',
    highlight: '#FDE7DA',
    sameValue: '#FBD3BD',
    selected: '#E8703A',
    userValue: '#D2562A',
    error: '#D9433D',
    gridLine: '#F0D9CA',
    gridLineBold: '#A6705A',
    note: '#9C7C6B',
  },
};

export const THEMES: Theme[] = [light, dark, forest, sunset];

export const DEFAULT_THEME_KEY = light.key;

export function getTheme(key: string): Theme {
  return THEMES.find((t) => t.key === key) ?? light;
}
