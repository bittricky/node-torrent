import torrentParser from "./src/torrent/torrent-parser";
import { getPeers } from "./src/tracker/tracker";
import { download } from "./src/client/peer";

const torrentPath = process.argv[2];
const torrent = torrentParser.open(torrentPath);

getPeers(torrent, (peers) => {
  peers.forEach((peerAddress) => {
    download(peerAddress, torrent);
  });
});
