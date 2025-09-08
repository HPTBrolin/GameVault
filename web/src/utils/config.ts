export function maskSecret(s?: string | null): string {
  if (!s) return "";
  if (s.length <= 4) return "•".repeat(s.length);
  return `${s.slice(0,2)}${"•".repeat(6)}…`;
}

export const PLATFORMS: string[] = [
  "PC","Nintendo Switch","PlayStation 5","PlayStation 4","Xbox Series X|S","Xbox One",
  "Nintendo 3DS","Wii U","Wii","PlayStation 3","Xbox 360","PS Vita","Android","iOS"
];
