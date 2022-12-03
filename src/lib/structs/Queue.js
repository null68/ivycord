const Track = require('./Track');

module.exports = class Queue {
  constructor() {
    this.songs = [];
    this.current = null;
    this.previous = null;
  }
  setCurrent(track) {
    if (!track) throw new Error('No track provided!');
    if (track instanceof Track) {
      this.current = track;
    } else throw new Error('Track must be an instance of Track!');
  }
  setPrevious(track) {
    if (!track) throw new Error('No track provided!');
    if (track instanceof Track) {
      this.previous = track;
    } else throw new Error('Track must be an instance of Track!');
  }
  add(track) {
    if (!track) throw new Error('No track provided!');
    if (track instanceof Track) {
      this.songs.push(track);
    } else throw new Error('Track must be an instance of Track!');
  }
  addToPosition(track, position) {
    if (!track) throw new Error('No track provided!');
    if (!position) throw new Error('No position provided!');
    if (track instanceof Track) {
      this.songs.splice(position, 0, track);
    } else throw new Error('Track must be an instance of Track!');
  }
  remove(position) {
    if (position == null) throw new Error('No track position provided!');
    if (position > this.songs.length - 1 || position < 0)
      throw new Error('Invalid track position!');
    this.songs.splice(position, 1);
  }
  clear() {
    this.songs = [];
  }
  shuffle() {
    for (let i = 0; i < this.songs.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
    }
  }
  get getQueue() {
    return this.songs;
  }
  get getFirst() {
    return this.songs[0];
  }
  get getLast() {
    return this.songs[this.songs.length - 1];
  }
  get getLength() {
    return this.songs.length;
  }
  get getCurrent() {
    return this.current;
  }
};
