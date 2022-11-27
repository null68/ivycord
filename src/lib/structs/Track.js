module.exports = class Track {
  constructor(track, info) {
    this.track = track;
    this.identifier = info.identifier;
    this.isSeekable = info.isSeekable;
    this.author = info.author;
    this.length = info.length;
    this.isStream = info.isStream;
    this.position = info.position;
    this.sourceName = info.sourceName;
    this.title = info.title;
    this.uri = info.uri;
  }
  get getThumbnail() {
    return `https://img.youtube.com/vi/${this.identifier}/maxresdefault.jpg`;
  }
};
