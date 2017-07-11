const path = require('path');
const jackDB = require('./').default;
const dataset = require('./jacks.json');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

const jacks = jackDB({
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY,
});

Promise.all(dataset.map(jack => jacks.insert(jack)))
  .then(() => process.exit());
