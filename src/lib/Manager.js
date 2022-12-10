const Node = require('./Node');
const Player = require('./Player');
const { EventEmitter } = require('events');
module.exports = class Manager extends EventEmitter {
  constructor(client, options) {
    super();
    this.options = options || {};
    this.shards = this.options.shards || 1;
    if (this.options.library == 'eris') {
      client.on('ready', () => {
        this.botID = client.user.id;
        this.sendData = packet => {
          const guild = client.guilds.get(packet.d.guild_id);
          if (!guild) return;
          guild.shard?.sendWS(packet.op, packet.d);
        };
      });
      client.on('rawWS', packet => {
        this.#updateVoicePackets(packet);
      });
    } else if (this.options.library == 'discord.js') {
      client.on('ready', () => {
        this.botID = client.user.id;
        this.sendData = packet => {
          const guild = client.guilds.cache.get(packet.d.guild_id);
          if (!guild) return;
          guild.shard?.send(packet);
        };
      });
      client.on('raw', packet => {
        this.#updateVoicePackets(packet);
      });
    } else {
      throw new Error(
        'No library provided! Add "library: \'eris\'" or "library: \'discord.js\'" to manager options.'
      );
    }
    this.nodes = [];
    this.players = [];
  }
  addNode(nodeOptions) {
    let node = new Node(this, nodeOptions);
    node.open();
    this.nodes.push(node);
  }
  addNodes(nodes) {
    for (let node of nodes) {
      this.addNode(node);
    }
  }

  removeNode(node) {
    node.close();
    this.nodes = this.nodes.filter(n => n !== node);
  }
  getIdealNode() {
    let ideal = this.nodes[0];
    for (let node of this.nodes) {
      if (node.stats.cpu.systemLoad < ideal.stats.cpu.systemLoad) {
        ideal = node;
      }
    }
    return ideal;
  }
  create(guildID, channelID) {
    if (!guildID) throw new Error('No guild ID provided!');
    if (!channelID) throw new Error('No channel ID provided!');
    let player = this.players.find(p => p.guild === guildID);
    if (player) return player;
    player = new Player(this, this.getIdealNode(), {
      guild: guildID,
      voice_channel: channelID,
    });
    this.players.push(player);
    return player;
  }

  #updateVoicePackets(packet) {
    switch (packet.t) {
      case 'VOICE_SERVER_UPDATE':
        this.#updateVoiceServerState(packet.d);
        break;
      case 'VOICE_STATE_UPDATE':
        this.#updateVoiceState(packet.d);
        break;
    }
  }
  #updateVoiceState(data) {
    let player = this.players.find(p => p.guild === data.guild_id);
    if (!player) return;
    if (data.user_id !== this.botID) return;
    player.setData({
      guild: data.guild_id,
      voice_channel: data.channel_id,
      sessionId: data.session_id,
    });
  }
  #updateVoiceServerState(data) {
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
  getPlayer(guildID) {
    return this.players.find(p => p.guild === guildID);
  }
};
