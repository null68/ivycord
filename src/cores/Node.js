const ws = require('ws');
const axios = require('axios');

module.exports = class Node {
  constructor(manager, options) {
    this.manager = manager || null;
    this.config = options.config || {};
    this.stats = {};
    this.connected = false;
    this.ws = null;
  }

  open() {
    let headers = {
      Authorization: this.config.password,
      'User-id': this.manager.botID,
      'Num-Shards': this.manager.shards,
      'Client-Name': 'Ivycord/0.0.1',
    };

    this.ws = new ws(this.config.url, { headers });
    this.ws.on('open', e => {
      this.connected = true;
      this.manager.emit('nodeConnect', this);
    });
  }
  sendData(data) {
    if (!data) throw new Error('No data provided!');
    if (!this.connected)
      throw new Error('Cannot send data to a disconnected node.');
    let json = JSON.stringify(data);
    this.ws.send(json, err => {
      if (err) throw new Error("Couldn't send data to the node. \n" + err);
    });
  }
  close() {
    this.ws.close();
    this.connected = false;
  }
};
