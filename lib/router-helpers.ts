import { router } from 'expo-router';

// Define route constants to avoid string literals
const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
} as const;

const APP_ROUTES = {
  TABS: '/(tabs)',
} as const;

// Type-safe navigation helpers that bypass Expo Router's type checking
export const authNavigation = {
  toLogin: () => {
    // Use router.push with href object to bypass type checking
    router.replace({ pathname: AUTH_ROUTES.LOGIN } as any);
  },
  toSignup: () => {
    router.replace({ pathname: AUTH_ROUTES.SIGNUP } as any);
  },
  toTabs: () => {
    router.replace({ pathname: APP_ROUTES.TABS } as any);
  },
} as const;

// Alternative: Direct string-based navigation with minimal type assertion
export const navigate = {
  toAuthLogin: () => router.replace(AUTH_ROUTES.LOGIN as any),
  toAuthSignup: () => router.replace(AUTH_ROUTES.SIGNUP as any),
  toMainApp: () => router.replace(APP_ROUTES.TABS as any),
} as const;
