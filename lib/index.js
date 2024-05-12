"use strict";

import fs from "fs";
import bencode from "bencode";

import dgram from "dgram";
import Buffer from "buffer";
import url from "url";

const torrent = bencode.decode(fs.readFileSync("./test/puppy.torrent"));

const torrentUrl = url(torrent.announce.toString("utf8"));

const socket = dgram.createSocket("udp6");

const msg = Buffer("hello?", "utf8");

socket.send(msg, 0, msg.length, torrentUrl.port, torrentUrl.host, () => {});

socket.on("message", (msg) => {
  console.log("message is ", msg);
});
