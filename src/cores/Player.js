module.exports = class Player {
  constructor(manager, node, options) {
    this.manager = manager;
    this.node = node;
    this.channel = options.channel || null;
    this.guild = options.guild || null;
    this.track = null;
    this.paused = false;
    this.volume = 100;
  }
  connect(channel) {
    if (!channel) throw new Error('No channel provided!');
    this.channel = channel;
    this.node.sendData({
      op: 4,
      d: {
        guild_id: this.guild,
        channel_id: this.channel,
        self_mute: false,
        self_deaf: false,
      },
    });
  }
  play(track) {
    if (!track) throw new Error('No track provided!');
    this.track = track;
    this.node.sendData({
      data: {
        op: 'play',
        guildId: this.guild,
        track: track,
        startTime: 0,
        endTime: 12000,
        volume: this.volume,
        noReplace: false,
        pause: false,
      },
    });
  }
};
