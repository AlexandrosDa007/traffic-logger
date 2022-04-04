import * as nodemailer from 'nodemailer';
import { DEV_MODE, EMAIL_CONFIG } from '../constants/environment';
if (DEV_MODE) {
  // For testing purposes
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
const MAILER_CONFIG = {
  alerts: {
    service: 'gmail',
    port: 465,
    auth: EMAIL_CONFIG,
    secure: !DEV_MODE,
  },
};
console.log(MAILER_CONFIG);

const alertTransporter = nodemailer.createTransport(MAILER_CONFIG.alerts);

/**
 * Send email using `alertTransporter` created
 * from nodemailer
 * @param options Options for mail
 */
export async function sendEmail(options: {
  subject: string;
  recipients: string[],
  html: string,
}) {
  const { subject, recipients, html } = options;
  const mailOptions: nodemailer.SendMailOptions = {
    from: `Alerts <${MAILER_CONFIG.alerts.auth.user}>`,
    to: recipients,
    subject,
    html,
  };
  try {
    await alertTransporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
}
