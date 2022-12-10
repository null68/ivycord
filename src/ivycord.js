module.exports = {
  Manager: require('./lib/Manager'),
  Node: require('./lib/Node'),
  version: require('../package.json').version,
  Player: require('./lib/Player'),
  Queue: require('./lib/structs/Queue'),
  Track: require('./lib/structs/Track'),
};
