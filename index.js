import { open } from "./src/torrent/torrent-parser.js";
import { getPeers } from "./src/tracker/tracker.js";
import { download } from "./src/client/peer.js";

const torrentPath = "./test/puppy.torrent";
const torrent = open(torrentPath);

getPeers(torrent, (peers) => {
  peers.forEach((peer) => {
    download(peer, torrent);
  });
});
