import fs from "fs";
import bencode from "bencode";
import crypto from "crypto";

export const open = (filepath) => {
  const torrent = bencode.decode(fs.readFileSync(filepath));
  return torrent;
};

export const size = (torrent) => {
  const size = torrent.info.files
    ? torrent.info.files.map((file) => file.length).reduce((a, b) => a + b)
    : torrent.info.length;

  return Buffer.from(BigInt(size).toString(16).padStart(16, "0"), "hex");
};

export const infoHash = (torrent) => {
  const info = bencode.encode(torrent.info);
  return crypto.createHash("sha1").update(info).digest();
};

export const pieceLength = (torrent, pieceIndex) => {
  const totalLength = size(torrent);
  const pieceLength = torrent.info["piece length"];
  const lastPieceLength = totalLength % pieceLength;
  const numberOfPieces = Math.ceil(totalLength / pieceLength);

  return pieceIndex === numberOfPieces - 1 ? lastPieceLength : pieceLength;
};

export const blockLength = (torrent, pieceIndex, blockIndex) => {
  const pieceLength = torrent.info["piece length"];
  const lastPieceLength = size(torrent) % pieceLength;
  const blockLength = 16384;

  if (pieceIndex === torrent.info.pieces.length / 20 - 1) {
    return blockIndex === Math.floor(lastPieceLength / blockLength)
      ? lastPieceLength % blockLength
      : blockLength;
  }

  return blockIndex === Math.floor(pieceLength / blockLength)
    ? pieceLength % blockLength
    : blockLength;
};

export const pieces = (torrent) => {
  const buffer = torrent.info.pieces;
  const pieces = [];

  for (let i = 0; i < buffer.length; i += 20) {
    pieces.push(buffer.slice(i, i + 20));
  }

  return pieces;
};
