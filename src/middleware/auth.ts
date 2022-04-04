import { RequestHandler } from "express";
import { API_KEY } from "../constants/environment";

/**
 * A very simple auth middleware based on
 * api key
 */
export const auth: RequestHandler = (req, res, next) => {
  const apiKey = req.query.apiKey;
  if (!apiKey) {
    res.status(401).send(`This action requires authentication`);
    return;
  }
  if (apiKey !== API_KEY) {
    res.status(403).send(`You don't have permission to do this`);
    return;
  }
  next();
};
