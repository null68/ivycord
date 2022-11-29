const ws = require('ws');
module.exports = class Node {
  constructor(manager, options) {
    this.manager = manager || null;
    this.config = options.config || {};
    this.stats = {};
    this.connected = false;
    this.ws = null;
    this.stats = {
      players: 0,
      playingPlayers: 0,
      uptime: 0,
      memory: {
        free: 0,
        allocated: 0,
        reservable: 0,
        used: 0,
      },
      cpu: {
        cores: 0,
        systemLoad: 0,
        lavalinkLoad: 0,
      },
    };
  }

  open() {
    let headers = {
      Authorization: this.config.password,
      'User-id': this.manager.botID,
      'Num-Shards': this.manager.shards,
      'Client-Name': 'Ivycord/0.0.1',
    };

    this.ws = new ws('ws://' + this.config.url, { headers });
    this.ws.on('open', e => {
      this.connected = true;
      this.manager.emit('nodeConnect', this);
    });
    this.ws.on('message', e => {
      let data = JSON.parse(e);
      if (data.op == 'stats') {
        this.stats = data;
        delete this.stats.op;
      }
      if (data.op == 'playerUpdate') {
        // TODO
      }
      if (data.op == 'event') {
        this.handleEvent(data);
      }
    });
    this.ws.on('close', e => {
      this.connected = false;
      this.manager.emit('nodeDisconnect', this);
    });
    this.ws.on('error', e => {
      this.connected = false;
      this.manager.emit('nodeError', this, e);
    });
  }
  handleEvent(data) {
    
  }
  sendWS(data) {
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
