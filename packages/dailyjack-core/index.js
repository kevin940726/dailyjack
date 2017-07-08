const jacks = require('./jacks.json');

module.exports = {
  default: jacks,
  all: () => jacks,
  random: () => jacks[Math.floor(Math.random() * jacks.length)],
  get: id => jacks[id - 1],
};
