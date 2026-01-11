import { Platform } from 'react-native';

export const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  small: 12,
  medium: 16,
} as const;

export type Typography = typeof typography;
