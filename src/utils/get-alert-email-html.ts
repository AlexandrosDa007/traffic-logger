import { AlertEmailData } from "../models/alert-email-data";

/**
 * Creates a html template for the alert email
 * @param data Data for this alert email
 */
export function getAlertEmailHtml(data: AlertEmailData) {
  return `
  <h2>Problem... Beware</h2>
  <p>All continents are suspended</p>
  <br>
  <table>
  <thead>
    <th>Continent Code</th>
    <th>Total score</th>
    <th>Total suspended time (ms)</th>
    <th>Suspended from</th>
    <th>Suspended until</th>
  </thead>
  ${Object.keys(data.continents ?? {}).map(continentKey => {
    return `
    <tr>
      <td>${continentKey}</td>
      <td>${data.continents[continentKey].totalScore}</td>
      <td>${data.continents[continentKey].totalSuspendedTimeMs}</td>
      <td>${data.continents[continentKey].timestamps.from}</td>
      <td>${data.continents[continentKey].timestamps.to}</td>
    </tr>
    `;
  })}
  </table>
  `;
}
