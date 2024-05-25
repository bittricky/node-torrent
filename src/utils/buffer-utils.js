export const bufferToString = (buffer) => buffer.toString("utf8");

export const stringToBuffer = (string) => Buffer.from(string, "utf8");

export const concatBuffers = (buffers) => Buffer.concat(buffers);

export const generateRandomBuffer = (length) => {
  const buffer = Buffer.alloc(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }
  return buffer;
};

export const sliceBuffer = (buffer, start, end) => buffer.slice(start, end);

export const bufferToHexString = (buffer) => buffer.toString("hex");

export const hexStringToBuffer = (hexString) => Buffer.from(hexString, "hex");
