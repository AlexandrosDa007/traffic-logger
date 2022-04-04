import { MINUTES_TO_SUSPEND_IN_MS, SCORING_MAP, VALID_CONTINENTS } from '../constants/environment';
import { continentsCol, db, suspendedContinentsRef } from '../db-refs';
import { ContinentCode } from '../models/continent';
import { SuspendedContinents } from '../models/suspended-continents';
import { getCurrentDay } from './get-current-day';

type ScoreTrafficResult = false | { error: { code: number, message: string } } | SuspendedContinents;

/**
 * Atomically score traffic for this continent.
 * Check if the continent is suspended or if it
 * was suspended to reinstate it. If the continent
 * is about to be suspended, check if all continents
 * are suspended.
 * @param continent The continent code 
 */
export async function scoreTraffic(continent: ContinentCode): Promise<ScoreTrafficResult> {
  const dayString = getCurrentDay();
  const docId = `${continent}_${dayString}`;
  const continentRef = continentsCol.doc(docId);

  // Get the day suspended continents
  const daySuspendedContinentsRef = suspendedContinentsRef.doc(dayString);
  const result = await db.runTransaction(async transaction => {
    const continentData = (await transaction.get(continentRef)).data() ?? {
      id: continent,
      score: 0,
      totalScore: 0,
      updatedAt: Date.now(),
    };
    const suspendedContinents = (await transaction.get(daySuspendedContinentsRef)).data() ?? { continents: {}, day: dayString };
    if (!suspendedContinents.continents[continent]) {
      suspendedContinents.continents[continent] = {
        id: continent,
        timestamps: {
          start: 0,
          end: 0,
        },
        totalSuspendedMs: 0,
      };
    }
    const wasSuspended = suspendedContinents.continents[continent].timestamps.end < Date.now() && continentData.score === 100;
    const isSuspended = suspendedContinents.continents[continent].timestamps.end >= Date.now();
    if (isSuspended) {
      // This is also checked on `logTraffic` 
      return { error: { code: 429, message: `Continent is suspended` } };
    }
    if (wasSuspended) {
      suspendedContinents.continents[continent].timestamps.start = 0;
      suspendedContinents.continents[continent].timestamps.end = 0;
      continentData.score = 0;
    }
    const scoreToAdd = SCORING_MAP[continent];
    const newScore = continentData.score + scoreToAdd;
    continentData.score = newScore;
    continentData.totalScore += scoreToAdd;
    transaction.set(continentRef, continentData);
    if (newScore >= 100) {
      // suspend
      suspendedContinents.continents[continent].timestamps = {
        start: Date.now(),
        end: Date.now() + MINUTES_TO_SUSPEND_IN_MS,
      };
      suspendedContinents.continents[continent].totalSuspendedMs += MINUTES_TO_SUSPEND_IN_MS;
      transaction.set(daySuspendedContinentsRef, suspendedContinents);
      // check if all are suspended
      const allSuspended = [...VALID_CONTINENTS, 'OTHER'].every(continent => suspendedContinents.continents[continent]?.timestamps.end > Date.now());
      if (allSuspended) {
        return suspendedContinents;
      }
    }
    return false;
  });
  return result;
}
