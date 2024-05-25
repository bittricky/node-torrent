const createPieceManager = (torrent) => {
  const pieces = Array(torrent.info.pieces.length / 20)
    .fill(null)
    .map((_, index) => ({
      index,
      requested: false,
      received: false,
      data: Buffer.alloc(0),
    }));

  const getRequestablePiece = () => {
    return pieces.find((piece) => !piece.requested && !piece.received);
  };

  const markRequested = (index) => {
    pieces[index].requested = true;
  };

  const markReceived = (index) => {
    pieces[index].received = true;
  };

  const addPieceData = (index, data) => {
    pieces[index].data = Buffer.concat([pieces[index].data, data]);
  };

  const isDone = () => {
    return pieces.every((piece) => piece.received);
  };

  const getPiece = (index) => pieces[index];

  const assembleFile = () => {
    return Buffer.concat(pieces.map((piece) => piece.data));
  };

  return {
    getRequestablePiece,
    markRequested,
    markReceived,
    addPieceData,
    isDone,
    getPiece,
    assembleFile,
  };
};

export default createPieceManager;
