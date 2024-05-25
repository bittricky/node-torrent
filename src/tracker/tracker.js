// src/tracker/tracker.js

import dgram from "dgram";
import { Buffer } from "buffer";
import crypto from "crypto";
import generatePeerId from "../utils/id-generator";
import torrentParser from "../torrent/torrent-parser";

const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const announceUrl = String.fromCharCode(...torrent.announce);
  const urlObj = new URL(announceUrl);

  sendConnect(socket, urlObj);

  socket.on("message", (response) => {
    if (responseType(response) === "connect") {
      const connectionResponse = parseConnectionResponse(response);
      const announceRequest = buildAnnounceRequest(
        connectionResponse.connectionId,
        torrent
      );
      socket.send(
        announceRequest,
        0,
        announceRequest.length,
        urlObj.port,
        urlObj.hostname
      );
    } else if (responseType(response) === "announce") {
      const announceResponse = parseAnnounceResponse(response);
      callback(announceResponse.peers);
    }
  });
};

const sendConnect = (socket, urlObj) => {
  const buf = Buffer.alloc(16);
  buf.writeUInt32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);
  buf.writeUInt32BE(0, 8);
  crypto.randomBytes(4).copy(buf, 12);

  socket.send(buf, 0, buf.length, urlObj.port, urlObj.hostname);
};

const buildAnnounceRequest = (connectionId, torrent) => {
  const buf = Buffer.alloc(98);
  connectionId.copy(buf, 0);
  buf.writeUInt32BE(1, 8);
  crypto.randomBytes(4).copy(buf, 12);
  torrentParser.infoHash(torrent).copy(buf, 16);
  generatePeerId().copy(buf, 36);
  Buffer.alloc(8).copy(buf, 56);
  torrentParser.size(torrent).copy(buf, 64);
  Buffer.alloc(8).copy(buf, 72);
  buf.writeUInt32BE(0, 80);
  buf.writeUInt32BE(0, 84);
  buf.writeUInt32BE(0, 88);
  buf.writeInt32BE(-1, 92);
  buf.writeUInt16BE(6881, 96);

  return buf;
};

const responseType = (res) => {
  const action = res.readUInt32BE(0);
  if (action === 0) return "connect";
  if (action === 1) return "announce";
};

const parseConnectionResponse = (res) => ({
  action: res.readUInt32BE(0),
  transactionId: res.readUInt32BE(4),
  connectionId: res.slice(8),
});

const parseAnnounceResponse = (res) => {
  const peers = [];
  for (let i = 20; i < res.length; i += 6) {
    peers.push({
      ip: res.slice(i, i + 4).join("."),
      port: res.readUInt16BE(i + 4),
    });
  }
  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    interval: res.readUInt32BE(8),
    leechers: res.readUInt32BE(12),
    seeders: res.readUInt32BE(16),
    peers,
  };
};

export { getPeers };
