import { ContinentCode } from "../models/continent";
import * as geoip from 'geoip-lite';
import { VALID_CONTINENTS } from "../constants/environment";
/**
 * Retrievs the continent's code from the ip address,
 * using the geoip-lite package. This is extremely fast
 * because its synchronous (all the data is in ram), but it
 * needs more ram in order to run this.
 * 
 * NOTE: This may not be accurate in some cases, because of the
 * dataset that  `maxmind` has.
 * @param ip The ip of the incoming request
 * @returns The region (continent) of the incoming request's origin
 */
export function getContinentFromIp(ip: string): ContinentCode {
  const data = geoip.lookup(ip);
  if (!data?.country) {
    return 'OTHER';
  }
  if (VALID_CONTINENTS.includes(data.country)) {
    return data.country as ContinentCode;
  }
  return 'OTHER';
}
