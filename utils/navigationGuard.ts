import { router } from "expo-router";

const NAVIGATION_DEBOUNCE_MS = 500;

let lastNavigationTime = 0;
let isNavigating = false;

function canNavigate(): boolean {
  const now = Date.now();
  if (isNavigating || now - lastNavigationTime < NAVIGATION_DEBOUNCE_MS) {
    return false;
  }
  return true;
}

function markNavigating(): void {
  isNavigating = true;
  lastNavigationTime = Date.now();

  setTimeout(() => {
    isNavigating = false;
  }, NAVIGATION_DEBOUNCE_MS);
}

// Store original methods
const originalPush = router.push.bind(router);
const originalReplace = router.replace.bind(router);
const originalNavigate = router.navigate.bind(router);
const originalBack = router.back.bind(router);

// Patch router methods
router.push = (...args: Parameters<typeof router.push>) => {
  if (!canNavigate()) return;
  markNavigating();
  return originalPush(...args);
};

router.replace = (...args: Parameters<typeof router.replace>) => {
  if (!canNavigate()) return;
  markNavigating();
  return originalReplace(...args);
};

router.navigate = (...args: Parameters<typeof router.navigate>) => {
  if (!canNavigate()) return;
  markNavigating();
  return originalNavigate(...args);
};

router.back = () => {
  if (!canNavigate()) return;
  markNavigating();
  return originalBack();
};

export function resetNavigationGuard(): void {
  isNavigating = false;
  lastNavigationTime = 0;
}
