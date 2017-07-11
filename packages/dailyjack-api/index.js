/* eslint-disable camelcase */
const ApiBuilder = require('claudia-api-builder');
const dailyjack = require('dailyjack-core');

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
        text: ':thumbsup:',
        type: 'button',
        value: '1',
      },
      {
        name: 'rate',
        text: ':thumbsdown:',
        type: 'button',
        value: '-1',
      },
    ],
    footer: `dailyjack #${jack.id}`,
    footer_icon: 'http://i.imgur.com/19yCcOJ.jpg',
  })),
});

api.post('/slack', (request) => {
  const body = request.post;

  if (body.channel_name.indexOf('all-') === 0) {
    return;
  }
  
  if (body.text === 'all') {
    return slackMessageBuilder(...dailyjack.all());
  }

  const id = parseInt(body.text, 10);
  if (Number.isInteger(id)) {
    return slackMessageBuilder(dailyjack.get(id));
  }

  return slackMessageBuilder(dailyjack.random());
});

api.post('/slack-button', (request) => {
  const { callback_id, actions, original_message } = JSON.parse(request.post.payload);

  const jack = original_message.attachments.find(attachment => attachment.callback_id === callback_id);

  actions.forEach((action) => {
    const index = jack.actions.findIndex(a => a.name === action.name && a.value === action.value);
    const responseAction = jack.actions[index];
    console.log(responseAction);
    const group = responseAction.text.split(' ');

    if (group.length < 2) {
      responseAction.text += ' 1';
    } else {
      group[1] = parseInt(group[1], 10) + 1;
      responseAction.text = group.join(' ');
    }
  });
  console.log(original_message);

  return original_message;
});

module.exports = api;
/* eslint-enable camelcase */
