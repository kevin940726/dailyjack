const admin = require('firebase-admin');

const DATABASE_URL = process.env.DATABASE_URL || 'https://dailyjack-8a930.firebaseio.com';
// const DATABASE_URL = 'https://dailyjack-d2fa0.firebaseio.com';

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
  const usersRef = db.ref('users');

  const insert = jack => (
    jacksRef
      .child(jack.id)
      .set({
        id: jack.id,
        title: jack.title,
        contents: jack.contents || [],
        author: jack.author || null,
        createdTime: Date.now(),
        isLimited: Boolean(jack.isLimited),
        isSpecial: Boolean(jack.isSpecial),
      })
      .then(() => (
        totalJacksRef.transaction(total => (total || 0) + 1)
      ))
  );

  const filter = (jacks = [], filterOptions = {}) => jacks.filter(
    jack => (!filterOptions.shouldExcludeLimited || !jack.isLimited)
      && (!filterOptions.shouldExcludeSpecial || !jack.isSpecial)
  );

  const all = (filterOptions = {}) => (
    jacksRef.once('value')
      .then(snapshot => snapshot.val())
      .then(jacks => (jacks || []).filter(Boolean))
      .then(jacks => filter(jacks, filterOptions))
  );

  const get = id => (
    jacksRef.child(id)
      .once('value')
      .then(snapshot => snapshot.val())
  );

  const random = (filterOptions = {}) => (
    all(filterOptions)
      .then(jacks => jacks[Math.floor(Math.random() * jacks.length)])
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

  const setUser = user => (
    usersRef.child(user.name)
      .set(user)
  );

  const updateUser = user => (
    usersRef.child(user.name)
      .update(user)
  );

  const getUser = userName => (
    usersRef.child(userName)
      .once('value')
      .then(snapshot => snapshot.val())
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
    setUser,
    updateUser,
    getUser,
  };
};

module.exports = {
  default: jackDB,
};
