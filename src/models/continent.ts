/**
 * Describes a continent for a
 * specific day
 */
export interface Continent {
  id: string;
  day: string;
  updatedAt: number;
  score: number;
  totalScore: number;
}
/**
 * All `Valid` continent codes
 */
export type ContinentCode = 'EU' | 'US' | 'AS' | 'OTHER';