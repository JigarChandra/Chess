class ForeSightProvider {
	static canGetCaptured(gameInfo, from, to) {
		let fen = gameInfo.fen();
		let futureGame = new Chess(fen);
		let currMove = from + "-" + to;
		futureGame.move(currMove, {sloppy: true});
		function isAttackingMove(move) {
				return (move.flags.includes("c") && (move.to === to));
		}
		return (futureGame.moves({verbose:true}).filter(isAttackingMove).length > 0);
	}

	static getBestCapture(gameInfo, pieceToMove, from, to) {
		// Return invalid move if pieceToMove is king since chess.put does not allow placing two kings of same color
		if (PieceInfoGenerator.generateType(pieceToMove) === gameInfo.KING) {
			return -1;
		}

		// Check for three fold reptition to avoid opponent claiming a draw
		// TODO: Fix, Does not work apparently
		gameInfo.move(from + "-" + to, {sloppy: true});
		if (gameInfo.in_threefold_repetition()) {
			console.log('Is three fold');
			gameInfo.undo();
			return -1;
		} else {
			gameInfo.undo();
		}

		let fen = gameInfo.fen();
		let futureGame = new Chess(fen);

		let removedPiece = futureGame.remove(from);
		if (removedPiece === null) {
			throw 'Could not remove piece at: ' + from;
		}
		let res = futureGame.put(removedPiece, to);

		if (res === false) {
			throw 'Invalid move from,to: ' + from + "," + to;
		}
		function isAttackingMove(move) {
				return (move.flags.includes("c") && (move.from === to));
		}

		try {
			let attackingMoves = futureGame.moves({verbose:true}).filter(isAttackingMove);
			return Math.max.apply(Math, attackingMoves.map(function(o) { return PieceInfoGenerator.generateScore(o.captured); }));
		} catch (err) {
			console.log('Encountered error: ' + err);
			return -1;
		}
	}	
}