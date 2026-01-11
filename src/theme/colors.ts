export const colors = {
  light: {
    background: '#FAFAFA',
    foreground: '#18181B',
    backgroundPrimary: '#1C1C1E',
    foregroundPrimary: '#FAFAFA',
    backgroundSecondary: '#52525B',
    foregroundSecondary: '#FAFAFA',
    backgroundMuted: '#E4E4E7',
    foregroundMuted: '#A1A1AA',
    backgroundDestructive: '#B91C1C',
    foregroundDestructive: '#DC2626',
  },
  dark: {
    background: '#18181B',
    foreground: '#FAFAFA',
    backgroundPrimary: '#3F3F46',
    foregroundPrimary: '#FAFAFA',
    backgroundSecondary: '#52525B',
    foregroundSecondary: '#FAFAFA',
    backgroundMuted: '#27272A',
    foregroundMuted: '#71717A',
    backgroundDestructive: '#7F1D1D',
    foregroundDestructive: '#F87171',
  },
} as const;

export type ThemeColors = typeof colors.light | typeof colors.dark;
