import net from "net";
import messageHandler from "./message-handler";
import torrentParser from "../torrent/torrent-parser";
import createPieceManager from "../torrent/piece-manager";

const download = (peer, torrent) => {
  const socket = new net.Socket();
  const pieceManager = createPieceManager(torrent);

  socket.on("error", (err) => {
    console.error(`Error with peer ${peer.ip}:${peer.port}`);
  });

  socket.connect(peer.port, peer.ip, () => {
    socket.write(buildHandshake(torrent));
  });

  onWholeMsg(socket, (msg) => {
    if (isHandshake(msg)) {
      socket.write(messageHandler.buildMessage.interested());
    } else {
      const parsedMsg = messageHandler.parse(msg);
      handleMessage(socket, parsedMsg, torrent, pieceManager);
    }
  });
};

const onWholeMsg = (socket, callback) => {
  let savedBuf = Buffer.alloc(0);
  let handshake = true;

  socket.on("data", (recvBuf) => {
    const msgLen = () =>
      handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4;
    savedBuf = Buffer.concat([savedBuf, recvBuf]);

    while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
      callback(savedBuf.slice(0, msgLen()));
      savedBuf = savedBuf.slice(msgLen());
      handshake = false;
    }
  });
};

const buildHandshake = (torrent) => {
  const buf = Buffer.alloc(68);
  buf.writeUInt8(19, 0);
  buf.write("BitTorrent protocol", 1);
  buf.writeUInt32BE(0, 20);
  buf.writeUInt32BE(0, 24);
  torrentParser.infoHash(torrent).copy(buf, 28);
  generatePeerId().copy(buf, 48);
  return buf;
};

const isHandshake = (msg) =>
  msg.length === 68 && msg.toString("utf8", 1, 20) === "BitTorrent protocol";

const handleMessage = (socket, parsedMsg, torrent, pieceManager) => {
  switch (parsedMsg.id) {
    case 0:
      console.log("choked");
      break;
    case 1:
      unchokeHandler(socket, torrent, pieceManager);
      break;
    case 4:
      haveHandler(socket, torrent, parsedMsg.payload, pieceManager);
      break;
    case 5:
      bitfieldHandler(socket, torrent, parsedMsg.payload, pieceManager);
      break;
    case 7:
      pieceHandler(socket, torrent, parsedMsg.payload, pieceManager);
      break;
  }
};

const unchokeHandler = (socket, torrent, pieceManager) => {
  requestPiece(socket, torrent, pieceManager);
};

const haveHandler = (socket, torrent, payload, pieceManager) => {
  const pieceIndex = payload.readUInt32BE(0);
  pieceManager.markRequested(pieceIndex);
  if (!pieceManager.isDone() && pieceManager.getRequestablePiece()) {
    requestPiece(socket, torrent, pieceManager);
  }
};

const bitfieldHandler = (socket, torrent, payload, pieceManager) => {
  if (!pieceManager.isDone() && pieceManager.getRequestablePiece()) {
    requestPiece(socket, torrent, pieceManager);
  }
};

const pieceHandler = (socket, torrent, payload, pieceManager) => {
  pieceManager.markReceived(payload.index);
  if (!pieceManager.isDone()) {
    requestPiece(socket, torrent, pieceManager);
  } else {
    console.log("Download complete");
    socket.end();
  }
};

const requestPiece = (socket, torrent, pieceManager) => {
  const piece = pieceManager.getRequestablePiece();
  if (piece) {
    const requestMsg = messageHandler.buildMessage.request({
      index: piece.index,
      begin: 0,
      length: torrentParser.pieceLength(torrent, piece.index),
    });
    socket.write(requestMsg);
    pieceManager.markRequested(piece.index);
  }
};

export { download };
