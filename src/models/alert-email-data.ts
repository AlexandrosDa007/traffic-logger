/**
 * Describes the object given to
 * a fn to produce a html for
 * alert emails.
 */
export interface AlertEmailData {
  continents: Record<string, {
    totalScore: number;
    totalSuspendedTimeMs: number;
    timestamps: {
      from: number;
      to: number;
    };
  }>;
}
