const axios = require('axios');

module.exports = {
  loadTracks(node, search) {
    return new Promise((resolve, reject) => {
      axios
        .get(`http://${node.config.url}/loadtracks?identifier=${search}`, {
          headers: {
            Authorization: node.config.password,
          },
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
};
