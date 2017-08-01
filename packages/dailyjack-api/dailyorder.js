const slackAPI = require('./slackAPI');
const { getToday } = require('./utils');

const ALL_LUNCH_CHANNEL_ID = 'C0T0LP8A0';

const USER_WHITE_LIST = [
  'U4PRX3K43', // kaihao
  'U4WM3NCPM', // julie
  'U0FST0VCP', // miffy
];

const slackMessageBuilder = orders => ({
  attachments: [
    {
      title: `${new Date().getMonth() + 1}/${new Date().getDate()} orders report`,
      color: 'good',
      fields: orders.map(order => ({
        title: order.name,
        value: `:${order.emoji}: (${order.total}): ${order.users.join(' ')}`,
      })),
    },
  ],
});

const getCorrectReactions = order => (
  order.total === order.users.length
    ? Promise.resolve(order)
    : slackAPI('reactions.get', {
      channel: ALL_LUNCH_CHANNEL_ID,
      timestamp: order.ts,
      full: true,
    })
      .then(({ message: { reactions } }) => [...new Set(
        reactions.reduce((concat, cur) => [...concat, ...cur.users], [])
      )])
      .then(users => Object.assign({}, order, { users }))
      .catch((err) => {
        console.error(err);
      })
);

const group = api => api.post('/group', (request) => {
  if (!USER_WHITE_LIST.includes(request.post.user_id)) {
    return 'Not authorized!';
  }

  const usersPromise = slackAPI('users.list')
    .then(({ members }) => members)
    .then(members => members.reduce((obj, cur) => Object.assign(obj, {
      [cur.id]: cur.name,
    }), {}));

  const ordersPromise = slackAPI('channels.history', {
    channel: ALL_LUNCH_CHANNEL_ID,
    oldest: getToday() / 1000,
  })
    .then(({ messages }) => messages)
    .then(messages => messages.filter(message => (
      message.type === 'message'
        && (message.text.startsWith('*') && message.text.endsWith('*'))
        && message.reactions && message.reactions.length
        && !message.subtype
        && !message.thread_ts
    )))
    .then(orders => orders.map(order => ({
      name: order.text.slice(1, -1),
      total: order.reactions.reduce((sum, reaction) => sum + reaction.count, 0),
      users: [...new Set(order.reactions.reduce((concat, cur) => [...concat, ...cur.users], []))],
      emoji: order.reactions[0].name,
      ts: order.ts,
    })))
    .then(orders => Promise.all(
      orders.map(order => getCorrectReactions(order))
    ))
    .catch((err) => {
      console.error(err);
    });

  return Promise.all([usersPromise, ordersPromise])
    .then(([users, orders]) => orders.map(order => Object.assign({}, order, {
      users: order.users.map(user => users[user]),
    })))
    .then(slackMessageBuilder);
});

module.exports = (api) => {
  group(api);
};
