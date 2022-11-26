const Node = require('./Node');
const Player = require('./Player');
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
  // TODO: Add better way to get ideal node
  getIdealNode() {
    let ideal = this.nodes[0];
    return ideal;
  }
  createPlayer(guildID, channelID) {
    let player = this.players.find(p => p.guild === guildID);
    if (player) return player;
    player = new Player(this, this.getIdealNode(), {
      guild: guildID,
      channel: channelID,
    });
    this.players.push(player);
    return player;
  }

  updateVoiceState(packet) {
    if (packet.t == 'VOICE_SERVER_UPDATE' || packet.t == 'VOICE_STATE_UPDATE') {
      // TODO: Events for voice state update
      let player = this.players.find(p => p.guild.id == packet.d.guild_id);
      if (!player) return;
      player.node.sendData({
        op: 4,
        d: {
          guild_id: packet.d.guild_id,
          session_id: packet.d.session_id,
          event: packet.d,
        },
      });
    }
  }
};
