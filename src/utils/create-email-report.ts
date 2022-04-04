import { continentsCol } from "../db-refs";
import { SuspendedContinents } from "../models/suspended-continents";
import { getCurrentDay } from "./get-current-day";
import { AlertEmailData } from "../models/alert-email-data";
import { sendEmail } from "./send-email";
import { getAlertEmailHtml } from "./get-alert-email-html";
import { ALERT_RECIPIENTS } from "../constants/environment";

/**
 * Creates and sends an email report for the current day,
 * when all the continents are suspended.
 * @param data The daily suspended continent data
 */
export async function createEmailReport(data: SuspendedContinents) {
  // Get all continent points
  const dayString = getCurrentDay();
  const allContinentData = (await continentsCol.where('day', '==', dayString).get()).docs.map(d => d.data());

  const reportUntilNow: AlertEmailData = {
    continents: allContinentData.reduce((prev, current) => {
      return {
        ...prev,
        [current.id]: {
          totalScore: current.totalScore,
          totalSuspendedTimeMs: data.continents[current.id].totalSuspendedMs,
          timestamps: data.continents[current.id].timestamps,
        },
      };
    }, {}),
  };

  // send email
  const html = getAlertEmailHtml(reportUntilNow);
  await sendEmail({
    html,
    recipients: ALERT_RECIPIENTS,
    subject: `Suspended continents`,
  });
}
