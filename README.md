# Node Torrent

> Simple exercise in building a node.js torrent client

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the [Node.js](https://nodejs.org/en/).

### Install

To install the project dependencies run the following command

```
$ npm install
```

### Development

```
$ npm run start
```

### Project Structure

```
node-torrent/
├── node_modules/
├── src/
│   ├── client/
│   │   ├── peer.js
│   │   ├── message-handler.js
│   ├── tracker/
│   │   ├── tracker.js
│   ├── torrent/
│   │   ├── torrent-parser.js
│   │   ├── piece-manager.js
│   ├── utils/
│   │   ├── buffer-utils.js
│   │   ├── id-generator.js
├── test/
│   ├── puppy.torrent
├── .gitignore
├── package.json
├── README.md
└── index.js
```

### Credit

based on the [how to make your own bittorrent client](https://allenkim67.github.io/programming/2016/05/04/how-to-make-your-own-bittorrent-client.html#getting-peers-via-the-tracker)
