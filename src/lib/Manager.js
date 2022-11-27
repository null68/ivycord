const Node = require('./Node');
const Player = require('./Player');
const { EventEmitter } = require('events');
module.exports = class Manager extends EventEmitter {
  constructor(client) {
    super();

    client.on('ready', () => {
      this.botID = client.user.id;
      this.shards = client.shards; // <- TODO: Make this s**t work
      this.sendData = packet => {
        const guild = client.guilds.get(packet.d.guild_id);
        if (!guild) return;
        guild.shard.sendWS(packet.op, packet.d);
      };
    });
    client.on('rawWS', packet => {
      this.updateVoicePackets(packet);
    });
    this.nodes = [];
    this.players = [];
  }
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
    for (let node of this.nodes) {
      if (node.stats.cpu.systemLoad < ideal.stats.cpu.systemLoad) {
        ideal = node;
      }
    }
    return ideal;
  }
  createPlayer(guildID, channelID) {
    let player = this.players.find(p => p.guild === guildID);
    if (player) return player;
    player = new Player(this, this.getIdealNode(), {
      guild: guildID,
      voice_channel: channelID,
    });
    this.players.push(player);
    return player;
  }

  updateVoicePackets(packet) {
    switch (packet.t) {
      case 'VOICE_SERVER_UPDATE':
        this.updateVoiceServerState(packet.d);
        break;
      case 'VOICE_STATE_UPDATE':
        this.updateVoiceState(packet.d);
        break;
    }
  }
  updateVoiceState(data) {
    let player = this.players.find(p => p.guild === data.guild_id);
    if (!player) return;
    if (data.user_id !== this.botID) return;
    player.setData({
      guild: data.guild_id,
      voice_channel: data.channel_id,
      sessionId: data.session_id,
    });
  }
  updateVoiceServerState(data) {
    let player = this.players.find(p => p.guild === data.guild_id);
    if (!player) return;
    if (!data.endpoint) throw new Error('No endpoint provided!');
    if (!player.sessionId) throw new Error('No session ID provided!');
    player.node.sendWS({
      op: 'voiceUpdate',
      guildId: data.guild_id,
      sessionId: player.sessionId,
      event: data,
    });
  }
};
