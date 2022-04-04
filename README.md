# App description

This app includes an express server
that logs the incoming traffic based on their continent

## Info
The continent is found using their ip and the `maxmind` dataset (GeoLite).
This is a very fast solution, but a ram intensive one. (Keeps all the information in the ram). The endpoint that are used `/ping` creates a score
for the continent that the request originates from. (Doesn't work from a proxy).
The app uses `firebase firestore` database to keep the information that is required.

The logTraffic middleware **atomically** updates score for the incoming request's continent code `(EU, AS, US, OTHER)`  and suspends the continent
if too many requests are being parsed. If all the continents are suspended it will send an email with `nodemailer` to `alerts@example.com`


## More
At each day a cron job will trigger the `/generate-report` endpoint and it will
create a report for the current day. This report is available from the `/reports/:day` endpoint.