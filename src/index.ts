import * as admin from 'firebase-admin';
// Initialize app before everything else
admin.initializeApp({
  credential: admin.credential.cert('./service-account.json'),
});

import express from 'express';
import * as bodyParser from 'body-parser';
import { logTraffic } from './middleware/log-traffic';
import { PORT } from './constants/environment';
import { getReport } from './handlers/get-report';
import { createReport } from './utils/create-report';
import { auth } from './middleware/auth';

const app = express();
// Use body parser to parse JSON `body`
app.use(bodyParser.json());

// Endpoints that don't log traffic
/**
 * Used by a cron job to generate report at the end of each day
 */
app.post('/generate-report', createReport);
app.use(auth);
/**
 * Retrieves the report for a specific day
 */
app.get('/report/:day', getReport);

// End points to log traffic
app.use(logTraffic);
/**
 * Ping the server for development purposes
 */
app.post('/ping', (req, res) => {
  res.send('ok');
});


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
