const fetch = require('node-fetch');
const queryString = require('query-string');

const BASE_URI = 'https://slack.com/api';
const { SLACK_TOKEN } = process.env;

const api = (method, options = {}) => (
  fetch(`${BASE_URI}/${method}?${queryString.stringify(
    Object.assign({ token: SLACK_TOKEN }, options)
  )}`)
    .then(res => res.json())
    .catch((err) => {
      console.error(err);
    })
);

module.exports = api;
