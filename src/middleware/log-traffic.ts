import { RequestHandler } from "express";
import { ContinentCode } from "../models/continent";
import { getContinentFromIp } from "../utils/get-continent-from-ip";
import { isContinentSuspended } from "../utils/is-continent-suspended";
import { scoreTraffic } from "../utils/score-traffic";
import { createEmailReport } from "../utils/create-email-report";

/**
 * Score the incoming request based on the continent
 * of the request. Checks if the specific continent is
 * suspended and blocks the requests
 * @param req The express request
 * @param res The express response
 * @param next The fn for the required resource
 */
export const logTraffic: RequestHandler = async (req, res, next) => {
  /** This will `not` be correct if user is behind a proxy */
  const ip = req.ip;
  /**
   * Get the continent code from ip
   */
  const continent: ContinentCode = getContinentFromIp(ip);
  // is continent suspended
  const isSuspended = await isContinentSuspended(continent);

  if (isSuspended) {
    res.status(429).send(`Too many requests`);
    return;
  }

  // Score for continent
  try {
    const result = await scoreTraffic(continent);
    if (typeof result === 'object') {
      // There was a problem
      if ('error' in result) {
        res.status(429).send(`Too many requests`);
        return;
      }
      await createEmailReport(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Something went wrong`);
    return;
  }
  next();
};
