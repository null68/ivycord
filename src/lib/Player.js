const songs = require('./utils/songs');
const Track = require('./structs/Track');
const Queue = require('./structs/Queue');
module.exports = class Player {
  constructor(manager, node, options) {
    this.manager = manager;
    this.node = node;
    this.voice_channel = options.voice_channel || null;
    this.guild = options.guild || null;
    this.sessionId = null;
    this.paused = false;
    this.volume = 50;
    this.queue = new Queue();
  }
  setData(data) {
    this.voice_channel = data.voice_channel || this.voice_channel;
    this.guild = data.guild || this.guild;
    this.sessionId = data.sessionId || this.sessionId;
  }
  setTrack(track) {
    if (!track) throw new Error('No track provided!');
    this.track = track;
  }
  connect(channel) {
    if (!channel) throw new Error('No channel provided!');
    this.channel = channel;
    this.manager.sendData({
      op: 4,
      d: {
        guild_id: this.guild,
        channel_id: this.channel,
        self_mute: false,
        self_deaf: false,
      },
    });
  }
  search(query) {
    if (!query) throw new Error('No query provided!');
    return new Promise((resolve, reject) => {
      songs
        .loadTracks(this.node, 'ytsearch: ' + query)
        .then(res => {
          let results = res.tracks.map(
            track => new Track(track.track, track.info)
          );
          resolve(results);
        })
        .catch(() => {
          reject(null);
        });
    });
  }
  play() {
    if (!this.queue.getCurrent) {
      if (!this.queue.getFirst) return null;
      this.queue.setCurrent(this.queue.getFirst);
      this.queue.remove(0);
    }
    return this.node.sendWS({
      op: 'play',
      guildId: this.guild,
      track: this.queue.getCurrent.track,
      volume: this.volume,
      noReplace: false,
      pause: false,
    });
  }
  pause(pause) {
    if (typeof pause !== 'boolean') throw new Error('Pause must be a boolean!');
    this.paused = pause;
    this.node.sendWS({
      op: 'pause',
      guildId: this.guild,
      pause,
    });
  }
  destroy() {
    this.node.sendWS({
      op: 'destroy',
      guildId: this.guild,
    });
  }
  stop() {
    this.node.sendWS({
      op: 'stop',
      guildId: this.guild,
    });
  }
  seek(position) {
    if (typeof position !== 'number')
      throw new Error('Position must be a number!');
    this.node.sendWS({
      op: 'seek',
      guildId: this.guild,
      position,
    });
  }
  setVolume(volume) {
    if (typeof volume !== 'number') throw new Error('Volume must be a number!');
    this.volume = volume;
    this.node.sendWS({
      op: 'volume',
      guildId: this.guild,
      volume,
    });
  }
};
