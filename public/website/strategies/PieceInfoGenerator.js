class PieceInfoGenerator {
	static generateScore(piece1) {
		function getScore(piece) {
			for (const p of PieceInfo.getPieces()) {
				if (p.val === piece.toLowerCase()) {
					return p.score;
				}
			}
			return -1;
		}
		let pieceScore = getScore(piece1);
		if (pieceScore === -1) {
			throw ("Invalid piece names: " + piece1);
		}
		return (pieceScore);
	}

	static generateType(pieceInitial) {
		function getType(piece) {
			for (const p of PieceInfo.getPieces()) {
				if (p.val === piece.toLowerCase()) {
					return p.type;
				}
			}
			return null;
		}
		let pieceType = getType(pieceInitial);
		if (pieceType === null) {
			throw ("Invalid piece initial: " + pieceInitial);
		}
		return (pieceType);
	}
}