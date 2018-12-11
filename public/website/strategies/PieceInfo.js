var PieceInfo = function() {
	let chess = new Chess();
	let pieces = [{val: "k", score: 20, type: chess.KING},
					  {val: "q", score: 14, type: chess.QUEEN},
					  {val: "r", score: 10, type: chess.ROOK},
					  {val: "n", score: 8, type: chess.KNIGHT},
					  {val: "b", score: 7, type: chess.BISHOP},
					  {val: "p", score: 2, type: chess.PAWN}];
	return {
		getPieces: function() {
		return pieces;
		}
	}
}();