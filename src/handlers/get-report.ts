import { RequestHandler } from "express";
import { reportsRef } from "../db-refs";

/**
 * Retrieves the report for a specific day
 * given by `req.params`
 * @param req The express request
 * @param res The express response
 */
export const getReport: RequestHandler = async (req, res) => {
  const day = req.params.day;
  if (!day || typeof day !== 'string') {
    res.status(400).send(`You must provide a valid day`);
    return;
  }
  if (!validateDay(day)) {
    res.status(400).send(`You must provide a valid day`);
    return;
  }

  // get document reference
  const report = (await reportsRef.doc(day).get()).data();
  if (!report) {
    res.status(404).send(`Report not found`);
    return;
  }
  res.status(200).send(report);
};

function validateDay(str: string): boolean {
  // Check if its a valid day
  const [year, month, day] = str.split('-');
  if (!year || !month || !day) {
    return false;
  }
  return str.length === 10;
}
