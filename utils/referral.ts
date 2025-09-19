export function generateReferralCode(name?: string): string {
  // Get initials if name is provided
  let prefix = "";
  if (name) {
    const nameParts = name.split(" ");
    prefix = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  }

  // If no initials, use a random letter
  if (!prefix) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    prefix = letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate random alphanumeric string (6 characters)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}${randomPart}`;
}