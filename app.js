import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

console.log('DEBUG ENV', process.env.NODE_ENV);

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.post('/authorize', (req, res) => {
  const authorizationCode = req.body.authorizationCode;

  authorize(authorizationCode)
    .then((tokenInfo) => {
      res.json({ message: 'Authorization Successful', tokenInfo: tokenInfo });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: 'An error occurred during authorization.' });
    });
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const jiraClientId = process.env.JIRA_CLIENT_ID;
const jiraClientSecret = process.env.JIRA_CLIENT_SECRET;
const redirectUrl = process.env.REDIRECT_URL;

const authorize = (authorizationCode) => {
  return fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: jiraClientId,
      client_secret: jiraClientSecret,
      code: authorizationCode,
      redirect_uri: redirectUrl,
    }),
  }).then((res) => res.json());
};
