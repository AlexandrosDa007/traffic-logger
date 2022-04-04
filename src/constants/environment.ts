import 'dotenv/config';
/**
 * The email auth configuration
 */
export const EMAIL_CONFIG = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
};
export const DEV_MODE = !!process.env.DEV;
/**
 * Current port
 */
export const PORT = DEV_MODE ? 3000 : process.env.PORT;
/**
 * The scoring map for each continent
 */
export const SCORING_MAP: Record<string, number> = {
  'EU': 15,
  'US': 10,
  'AS': 5,
  'OTHER': 1,
};
/**
 * Minutes to suspend continent
 */
export const MINUTES_TO_SUSPEND_IN_MS = 2 * 60 * 1000;
/**
 * Valid continents
 */
export const VALID_CONTINENTS = ['EU', 'US', 'AS'];
/**
 * All the emails to send alert to
 */
export const ALERT_RECIPIENTS = ['alert@example.com'];
/**
 * The api key used by the cron job trigger
 */
export const CRON_API_KEY = process.env.cron_api_key;
/**
 * 'Normal' API key for all endpoints except
 * `generateReport`
 */
export const API_KEY = process.env.api_key