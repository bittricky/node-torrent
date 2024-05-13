import dgram from "dgram";
import { Buffer } from "buffer";

module.exports.getPeers = (torrent, cb) => {
  const socket = dgram.createSocket("udp6");
  const announceUrl = String.fromCharCode(...torrent.announce);
  const url = new URL(announceUrl);

  udpSend(socket, buildConnectReq(), url);

  socket.on("message", (res) => {
    if (resType(res) === "connect") {
      const connResp = parseConnResp(res);

      const announceReq = buildAnnounceReq(connResp.connectionId);
      udpSend(socket, announceReq, url);
    } else if (respType(response) === "announce") {
      const announceResp = parseAnnounceResp(response);

      cb(announceResp.peers);
    }
  });
};

function udpSend(socket, message, rawUrl, callback = () => {}) {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
}

function respType(resp) {
  // ...
}

function buildConnReq() {
  // ...
}

function parseConnResp(resp) {
  // ...
}

function buildAnnounceReq(connId) {
  // ...
}

function parseAnnounceResp(resp) {
  // ...
}
