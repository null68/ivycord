const Node = require('./Node');
const { EventEmitter } = require('events');
module.exports = class Manager extends EventEmitter {
  constructor(client) {
    super();

    client.on('ready', () => {
      this.botID = client.user.id;
      this.shards = client.shards; // <- TODO: Make this s**t work
    });
    this.nodes = [];
    this.players = [];
  }
  /*
  Node example:
  {
    manager, {
    config: {
        url: '127.0.0.1:1234',,
        password: "youshallnotpass",
    }
  }}
  */
  addNode(manager, nodeOptions) {
    let node = new Node(manager, nodeOptions);
    node.open();
    this.nodes.push(node);
  }

  removeNode(node) {
    node.close();
    this.nodes = this.nodes.filter(n => n !== node);
  }

  updateVoiceState(packet) {
    if (packet.t == 'VOICE_SERVER_UPDATE' || packet.t == 'VOICE_STATE_UPDATE') {
      // TODO: Player update logic
    }
  }
};
