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
    footer: `dailyjack #${jack.id}`,
    footer_icon: 'http://i.imgur.com/19yCcOJ.jpg',
  })),
});

api.post('/slack', (request) => {
  const body = request.post;

  if (body.text === 'all') {
    return slackMessageBuilder(...dailyjack.all());
  }

  const id = parseInt(body.text, 10);
  if (Number.isInteger(id)) {
    return slackMessageBuilder(dailyjack.get(id));
  }

  return slackMessageBuilder(dailyjack.random());
});

module.exports = api;
