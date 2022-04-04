import { suspendedContinentsRef } from "../db-refs";
import { ContinentCode } from "../models/continent";
import { getCurrentDay } from "./get-current-day";

/**
 * Checks if the continent is suspended and until
 * when.
 * @param continent The continent's code to check
 */
export async function isContinentSuspended(continent: ContinentCode): Promise<boolean> {
  const dayString = getCurrentDay();
  const suspendedContinentsData = (await suspendedContinentsRef.doc(dayString).get()).data() ?? { continents: {}, day: dayString };
  const continentData = (suspendedContinentsData.continents ?? {})[continent];
  if (!continentData) {
    return false;
  }
  return continentData.timestamps.end >= Date.now();
}
