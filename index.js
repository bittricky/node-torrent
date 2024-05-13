"use strict";

import fs from "fs";
import bencode from "bencode";

import dgram from "dgram";
import { Buffer } from "buffer";

const torrent = bencode.decode(fs.readFileSync("./test/puppy.torrent"));

const announceUrl = String.fromCharCode(...torrent.announce);

const url = new URL(announceUrl);

const socket = dgram.createSocket("udp6");

const msg = Buffer.from("hello?", "utf8");

socket.send(msg, 0, msg.length, url.port, url.host, () => {});

socket.on("message", (msg) => {
  console.log("message is ", msg.toString());
});
