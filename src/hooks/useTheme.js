import { useSyncExternalStore } from 'react';
import { getTheme, subscribeTheme } from '../themeState';

export function useTheme() {
  return useSyncExternalStore(subscribeTheme, getTheme);
}
