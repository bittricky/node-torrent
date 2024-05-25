import crypto from "crypto";

const generatePeerId = () => {
  const id = Buffer.alloc(20);
  id.write("-GT0001-");
  crypto.randomBytes(12).copy(id, 8);
  return id;
};

export default generatePeerId;
