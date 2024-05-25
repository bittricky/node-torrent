import { open } from "./src/torrent/torrent-parser";
import { getPeers } from "./src/tracker/tracker";
import { download } from "./src/client/peer";

const torrentPath = "./test/puppy.torrent";
const torrent = open(torrentPath);

getPeers(torrent, (peers) => {
  peers.forEach((peer) => {
    download(peer, torrent);
  });
});
