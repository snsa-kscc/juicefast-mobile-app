// Shared utility functions for data operations

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random items from array, optionally excluding one by ID
 */
export function getRandomItems<T extends { id: string }>(
  items: T[],
  count: number = 5,
  excludeId?: string
): T[] {
  const filtered = excludeId
    ? items.filter((item) => item.id !== excludeId)
    : items;
  return shuffle(filtered).slice(0, Math.min(count, filtered.length));
}

/**
 * Format minutes to human-readable duration string
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Get Tailwind background color class for difficulty level
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "beginner":
      return "bg-green-500";
    case "medium":
    case "intermediate":
      return "bg-yellow-500";
    case "hard":
    case "advanced":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

/**
 * Convert kebab-case to Title Case with special handling
 */
export function formatKebabToTitle(kebab: string): string {
  return kebab
    .split("-")
    .map((word) => {
      if (word.toLowerCase() === "diy") return "DIY";
      if (word.toLowerCase() === "and") return "&";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
