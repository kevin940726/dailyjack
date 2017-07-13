const admin = require('firebase-admin');

const DATABASE_URL = 'https://dailyjack-8a930.firebaseio.com';

const jackDB = (config = {}) => {
  const app = admin.initializeApp({
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

  const insert = jack => (
    jacksRef
      .child(jack.id)
      .set({
        id: jack.id,
        title: jack.title,
        contents: jack.contents,
        author: jack.author,
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
      .then(jacks => jacks.filter(Boolean))
  );

  const get = id => (
    jacksRef.child(id)
      .once('value')
      .then(snapshot => snapshot.val())
  );

  const random = () => (
    totalJacksRef.once('value')
      .then(snapshot => snapshot.val())
      .then(total => get(Math.floor(Math.random() * total) + 1))
  );

  const upvote = (id, user) => (
    jacksRef.child(id)
      .child('ratedUsers')
      .child(user)
      .set(true)
  );

  const downvote = (id, user) => (
    jacksRef.child(id)
      .child('ratedUsers')
      .remove(user)
  );

  const togglevote = (id, user) => (
    jacksRef.child(id)
      .child('ratedUsers')
      .child(user)
      .transaction(rate => (rate ? null : true))
  );

  const getRate = id => (
    jacksRef.child(id)
      .child('ratedUsers')
      .once('value')
      .then(snapshot => snapshot.val())
      .then(rate => Object.keys(rate || {})
        .filter(Boolean)
        .length
      )
  );

  const exit = () => {
    db.goOffline();
    app.delete();
  };

  return {
    all,
    get,
    random,
    insert,
    exit,
    upvote,
    downvote,
    togglevote,
    getRate,
  };
};

module.exports = {
  default: jackDB,
};
