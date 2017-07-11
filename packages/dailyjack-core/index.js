const admin = require('firebase-admin');

const DATABASE_URL = 'https://dailyjack-8a930.firebaseio.com';

const jackDB = (config = {}) => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey,
    }),
    databaseURL: DATABASE_URL,
  });

  const db = admin.database();
  const jacksRef = db.ref('jacks');
  const totalJacksRef = db.ref('totalJacks');

  const insert = (jack) => (
    jacksRef
      .child(jack.id)
      .set({
        id: jack.id,
        title: jack.title,
        contents: jack.contents,
        arthor: jack.arthor,
        rate: 0,
        ratedUsers: [],
        createdTime: Date.now(),
        isLimited: false,
      })
      .then(() => (
        totalJacksRef.transaction(total => (total || 0) + 1)
      ))
  );

  const all = () => (
    jacksRef.once('value')
      .then(snapshot => snapshot.val())
  );

  const get = (id) => (
    jacksRef.child(id)
      .once('value')
      .then(snapshot => snapshot.val())
  );

  const random = () => (
    totalJacksRef.once('value')
      .then(snapshot => snapshot.val())
      .then(total => get(Math.floor(Math.random() * total) + 1))
  );

  const exit = () => (
    db.goOffline()
  );

  return {
    all,
    get,
    random,
    insert,
    exit,
  };
}

module.exports = {
  default: jackDB,
};
