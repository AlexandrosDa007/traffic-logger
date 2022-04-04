import { RequestHandler } from "express";
import { CRON_API_KEY } from "../constants/environment";
import { continentsCol, db, reportsRef, suspendedContinentsRef } from "../db-refs";
import { ContinentReport } from "../models/report";
import { getCurrentDay } from "./get-current-day";

/**
 * Create a daily report and save it to the db
 * This fn should run at the end of each day (with a cron job)
 */
export const createReport: RequestHandler = async (req, res) => {
  const apiKey = req.query.apiKey;
  // Validate api key from cron job
  if (apiKey !== CRON_API_KEY) {
    res.status(403).send(`Forbidden`);
    return;
  }
  const dayString = getCurrentDay();
  const reportData = await db.runTransaction(async transaction => {
    const query = continentsCol.where('day', '==', dayString);
    const allContinentData = (await transaction.get(query)).docs.map(d => d.data());
    const suspendedContinents = (await transaction.get(suspendedContinentsRef.doc(dayString))).data() ?? { continents: {}, day: dayString };
    const continentsData: ContinentReport['continents'] = {};
    allContinentData.forEach(continent => {
      continentsData[continent.id].totalScore = continent.totalScore;
      continentsData[continent.id].totalSuspendedTimeMs = suspendedContinents.continents[continent.id]?.totalSuspendedMs ?? 0;
    });
    const report: ContinentReport = {
      id: `r_${dayString}`,
      day: dayString,
      continents: continentsData,
    };
    return report;
  });

  await reportsRef.doc(dayString).set(reportData);
  res.send('ok');
}
