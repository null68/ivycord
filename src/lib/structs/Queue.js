module.exports = class Queue {
  constructor() {
    this.songs = [];
    this.current = null;
    this.previous = null;
  }
  add(track) {
    if (!track) throw new Error('No track provided!');
    this.songs.push(track);
  }
  add(track, position) {
    if (!track) throw new Error('No track provided!');
    if (!position) throw new Error('No position provided!');
    this.songs.splice(position, 0, track);
  }
  remove(position) {
    if (!position) throw new Error('No track position provided!');
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
  set setCurrent(track) {
    if (!track) throw new Error('No track provided!');
    this.current = track;
  }
};
