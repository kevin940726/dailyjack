/* eslint-disable camelcase */
const ApiBuilder = require('claudia-api-builder');
const dailyjackCore = require('dailyjack-core').default;

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

const dailyjack = dailyjackCore({
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY,
});

const api = new ApiBuilder();

api.get('/', () => dailyjack.all());

api.get('/random', () => dailyjack.random());

api.get('/{id}', request => (
  dailyjack.get(request.pathParams.id)
));

const slackMessageBuilder = (...jacks) => ({
  response_type: 'in_channel',
  attachments: jacks.map(jack => ({
    title: jack.title,
    text: (jack.contents || []).join('\n'),
    callback_id: jack.id,
    actions: [
      {
        name: 'rate',
        text: [':thumbsup:', Object.keys(jack.ratedUsers || {}).length]
          .filter(Boolean)
          .join(' '),
        type: 'button',
        value: '1',
      },
    ],
    footer: `dailyjack #${jack.id} @${jack.author}`,
    footer_icon: 'http://i.imgur.com/19yCcOJ.jpg',
  })),
});

api.post('/slack', (request) => {
  const body = request.post;

  if (body.channel_name.indexOf('all-') === 0) {
    return;
  }

  if (body.text === 'all') {
    return dailyjack.all()
      .then(all => slackMessageBuilder(...all));
  }

  const id = parseInt(body.text, 10);
  if (Number.isInteger(id)) {
    return dailyjack.get(id)
      .then(slackMessageBuilder);
  }

  return dailyjack.random()
    .then(slackMessageBuilder);
});

api.post('/slack-button', (request) => {
  const { callback_id, actions, user, original_message } = JSON.parse(request.post.payload);

  const jack = original_message.attachments.find(attachment => attachment.callback_id === callback_id);

  const actionsPromise = actions.map((action, index) => {
    if (action.name === 'rate') {
      return dailyjack.togglevote(callback_id, user.name)
        .then(() => dailyjack.getRate(callback_id))
        .then((rate) => {
          jack.actions[index].text = [':thumbsup:', rate]
            .filter(Boolean)
            .join(' ');
        });
    }

    return Promise.resolve();
  });

  return Promise.all(actionsPromise)
    .then(() => original_message);
});

module.exports = api;
/* eslint-enable camelcase */
