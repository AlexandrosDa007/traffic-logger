/**
 * The data produced for the daily report
 */
export interface ContinentReport {
  id: string;
  day: string;
  continents: Record<string, {
    totalScore: number;
    totalSuspendedTimeMs: number;
  }>;
}