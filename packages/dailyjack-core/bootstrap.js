const jackDB = require('./').default;
const dataset = require('./jacks.json');
const env = require('../../.env.json');

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = env || process.env;

const dailyjack = jackDB({
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY,
});

dailyjack.all()
  .then(jacks => Promise.all(
    dataset.slice(jacks.length)
      .map(jack => dailyjack.insert(jack))
  ))
  .then(() => process.exit());
