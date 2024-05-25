const parse = (msg) => {
  const id = msg.length > 4 ? msg.readUInt8(4) : null;
  const payload = msg.length > 5 ? msg.slice(5) : null;

  return {
    size: msg.readUInt32BE(0),
    id,
    payload,
  };
};

const buildMessage = {
  choke: () => Buffer.from([0, 0, 0, 1, 0]),
  unchoke: () => Buffer.from([0, 0, 0, 1, 1]),
  interested: () => Buffer.from([0, 0, 0, 1, 2]),
  notInterested: () => Buffer.from([0, 0, 0, 1, 3]),
  have: (payload) => {
    const buf = Buffer.alloc(9);
    buf.writeUInt32BE(5, 0);
    buf.writeUInt8(4, 4);
    buf.writeUInt32BE(payload, 5);
    return buf;
  },
  bitfield: (payload) => {
    const buf = Buffer.alloc(5 + payload.length);
    buf.writeUInt32BE(1 + payload.length, 0);
    buf.writeUInt8(5, 4);
    payload.copy(buf, 5);
    return buf;
  },
  request: (payload) => {
    const buf = Buffer.alloc(17);
    buf.writeUInt32BE(13, 0);
    buf.writeUInt8(6, 4);
    buf.writeUInt32BE(payload.index, 5);
    buf.writeUInt32BE(payload.begin, 9);
    buf.writeUInt32BE(payload.length, 13);
    return buf;
  },
  piece: (payload) => {
    const buf = Buffer.alloc(9 + payload.block.length);
    buf.writeUInt32BE(9 + payload.block.length, 0);
    buf.writeUInt8(7, 4);
    buf.writeUInt32BE(payload.index, 5);
    buf.writeUInt32BE(payload.begin, 9);
    payload.block.copy(buf, 13);
    return buf;
  },
  cancel: (payload) => {
    const buf = Buffer.alloc(17);
    buf.writeUInt32BE(13, 0);
    buf.writeUInt8(8, 4);
    buf.writeUInt32BE(payload.index, 5);
    buf.writeUInt32BE(payload.begin, 9);
    buf.writeUInt32BE(payload.length, 13);
    return buf;
  },
};

export default {
  parse,
  buildMessage,
};
