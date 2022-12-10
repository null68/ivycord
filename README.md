## Welcome to Ivycord

- Ivycord is a Lavalink client for Discord that supports eris and discord.js, designed to provide a simple and powerful way to play audio in your Discord server. With Ivycord, you can easily control audio playback, manage the queue, and search for tracks to add to the queue.

## Installation

- To use Ivycord, you will need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your system. Once you have these prerequisites, you can install Ivycord using the following command:
```sh 
npm install ivycord
```

Usage
Once you have installed Ivycord, you can use it in your Node.js project by requiring it and creating a new instance of the `Manager` class:

```js
// Import the Manager class from the ivycord package
const { Manager } = require('ivycord');

// Create a new Ivycord Manager instance, passing in the Discord.js/Eris client
const ivycord = new Manager(client, {
  library: "eris", // or discord.js
  shards: 1
});

client.on("ready", () => {
  // When the client is ready, add a Lavalink node to the manager
  ivycord.addNode({
    config: {
      url: 'localhost:2333', // URL of the Lavalink server
      password: 'youshallnotpass', // Password for the Lavalink server
    },
  });
});
```
Once you have created an instance of the Ivycord class and connected to your Lavalink server, you can use the following methods to control audio playback:
```js
// Create a new audio player for the specified guild and channel
let player = ivycord.create("guildID", "channelID");

// Add a track to the queue
player.queue.add(track: Track);

// Start playback
player.play();

// Pause playback
player.pause();

// Resume playback
player.resume();

// Skip the current track
player.skip();
```
You can also use the `queue` property of the `Player` instance to view and manage the current queue of tracks:
```js
// View the current queue
console.log(player.queue);

// Clear the queue
player.queue.clear();
```

## Need help?

- If you have any questions or need help getting started with Ivycord, you can [create an issue on GitHub](https://github.com/null68/ivycord/issues) and we will be happy to assist you. We also welcome any feedback or suggestions you may have to improve Ivycord.
