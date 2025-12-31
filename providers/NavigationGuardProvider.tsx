import React, { createContext, useContext, useRef, useCallback } from "react";
import { router } from "expo-router";

const NAVIGATION_DEBOUNCE_MS = 500;

interface NavigationGuardContextType {
  navigate: (path: string, params?: Record<string, any>) => void;
  push: (path: string, params?: Record<string, any>) => void;
  replace: (path: string, params?: Record<string, any>) => void;
  back: () => void;
  canNavigate: () => boolean;
}

const NavigationGuardContext = createContext<NavigationGuardContextType | null>(
  null
);

export function NavigationGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lastNavigationTime = useRef<number>(0);
  const isNavigating = useRef<boolean>(false);

  const canNavigate = useCallback(() => {
    const now = Date.now();
    if (
      isNavigating.current ||
      now - lastNavigationTime.current < NAVIGATION_DEBOUNCE_MS
    ) {
      return false;
    }
    return true;
  }, []);

  const guardedNavigate = useCallback(
    (
      action: "navigate" | "push" | "replace",
      path: string,
      params?: Record<string, any>
    ) => {
      if (!canNavigate()) {
        return;
      }

      isNavigating.current = true;
      lastNavigationTime.current = Date.now();

      try {
        if (action === "navigate") {
          router.navigate(path as any, params);
        } else if (action === "push") {
          router.push(path as any, params);
        } else if (action === "replace") {
          router.replace(path as any, params);
        }
      } finally {
        // Reset navigation lock after a short delay
        setTimeout(() => {
          isNavigating.current = false;
        }, NAVIGATION_DEBOUNCE_MS);
      }
    },
    [canNavigate]
  );

  const navigate = useCallback(
    (path: string, params?: Record<string, any>) => {
      guardedNavigate("navigate", path, params);
    },
    [guardedNavigate]
  );

  const push = useCallback(
    (path: string, params?: Record<string, any>) => {
      guardedNavigate("push", path, params);
    },
    [guardedNavigate]
  );

  const replace = useCallback(
    (path: string, params?: Record<string, any>) => {
      guardedNavigate("replace", path, params);
    },
    [guardedNavigate]
  );

  const back = useCallback(() => {
    if (!canNavigate()) {
      return;
    }

    isNavigating.current = true;
    lastNavigationTime.current = Date.now();

    try {
      router.back();
    } finally {
      setTimeout(() => {
        isNavigating.current = false;
      }, NAVIGATION_DEBOUNCE_MS);
    }
  }, [canNavigate]);

  return (
    <NavigationGuardContext.Provider
      value={{ navigate, push, replace, back, canNavigate }}
    >
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  const context = useContext(NavigationGuardContext);
  if (!context) {
    throw new Error(
      "useNavigationGuard must be used within a NavigationGuardProvider"
    );
  }
  return context;
}
