export const colors = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
  },
} as const;

export type ThemeColors = typeof colors.light | typeof colors.dark;
