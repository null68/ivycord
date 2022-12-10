const Track = require('./Track');
module.exports = class Queue extends Array {
  constructor() {
    super(...arguments);
  }
  add(track) {
    this.push(track);
    return this;
  }
  add_to(track, position) {
    this.splice(position, 0, track);
    return this;
  }
  first() {
    return this[0] || null;
  }
  last() {
    return this[this.length - 1] || null;
  }
  get(position) {
    if (position > this.length - 1 || position < 0)
      throw new Error('Invalid track position!');
    return this[position];
  }
  remove(position) {
    if (position > this.length - 1 || position < 0)
      throw new Error('Invalid track position!');
    this.splice(position, 1);
    return this;
  }
  clear() {
    this.splice(0, this.length);
    return this;
  }
  shuffle() {
    for (let i = 0; i < this.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
  }
};
