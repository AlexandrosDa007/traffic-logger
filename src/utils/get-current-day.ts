/**
 * Retrieve the current day in format `YYYY-MM-DD`
 */
export function getCurrentDay(): string {
  const dayString = new Date().toISOString().substring(0, 10);
  return dayString;
}
