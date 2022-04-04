/**
 * The daily suspended continents
 */
export interface SuspendedContinents {
  day: string;
  continents: Record<string, {
    id: string;
    totalSuspendedMs: number;
    timestamps: {
      start: number;
      end: number;
    };
  }>;
}