// TODO: find cumulative damage at an attacking position - for e.g trying to attack a bishop which is supported by a Queen, with two pawns
// should result in a positive score attack 
// For next best attacking move: Amplify capture by least valuable piece by giving higher weightage, search amongst only non-capture moves
class NextAttackingMoveGenerator {
	/*
	TODO: Does not handle en-passant
	Excellent e.g: 'rnbqkbnr/p1p1pppp/1p1p4/8/8/2N3P1/PPPPPP1P/R1BQKBNR w KQkq - 0 3', will result in white bishop from f1 to g2 and
	an inevitable capture of rook at a8
	*/
	static getNextBestAttackingMove(gameInfo, fromPos) {
		// Use a factor of approx 0.7 to encourage immediate attacks
		// TODO: Consider damage by self-piece getting captured on making the next best offensive move
			function isValidMove(move) {
				if (typeof fromPos === 'string') {
					return (move.from === fromPos && (! move.flags.includes('e')));
				}
				return (! move.flags.includes('e'));
			}
			var nonAttackingMoves = gameInfo.moves({verbose:true}).filter(isValidMove);

			if (nonAttackingMoves.length > 0) {
				var currBestScore = -1;
				var currBestCapturedByScore =  Number.MAX_SAFE_INTEGER;
				var currBestMove = null;

				// TODO: flip turns and find opponentBestAttackingScore.
				let currFen = gameInfo.fen();
				var flippedFen = null;
				var tempFen = null;
				if (gameInfo.turn() === 'w') {
					// change turn to b
					tempFen = currFen.replace('w', 'b');
				} else {
					// change turn to w
					tempFen = currFen.replace(' b ', ' w '); // spaces since white bishop is also represented by b
				}
				let tempFenArr = tempFen.split(' ');
				tempFenArr[3] = '-';
				flippedFen = tempFenArr.join(' ');
				var futureGame = new Chess();
				let loadRes = futureGame.load(flippedFen);
				if (!loadRes) {
					throw 'Could not flip turn. orig FEN, flipped FEN: ' + currFen + ' , ' + flippedFen;
				}
				let currOpponentBestAttackingMove = AttackingMoveGenerator.getBestAttackingMove(futureGame);

				function getMoveWithBestScore(move) {
					let piece1 = move.piece;
					let piece1Score = PieceInfoGenerator.generateScore(piece1);
					var currScore = -1;
					var currCapturedByScore =  Number.MAX_SAFE_INTEGER;

					if (ForeSightProvider.getBestCapture(gameInfo, piece1, move.from, move.to) > piece1Score &&
						//!ForeSightProvider.canGetCaptured(gameInfo, move.from, move.to)
						AttackingMoveGenerator.getBestAttackingMove(gameInfo, move.to).score < 0
						) {

						let futGame = new Chess(gameInfo.fen());
						futGame.move(move.from + '-' + move.to, {sloppy: true});
						let opponentBestAttackingMove = AttackingMoveGenerator.getBestAttackingMove(futGame);

						// ensure that this move does not make any other piece vulnerable
						if ((opponentBestAttackingMove.score <= currOpponentBestAttackingMove.score 
						 && !ForeSightProvider.canGetCaptured(gameInfo, move.from, move.to)
						 ) || (opponentBestAttackingMove.score < 0)) {
							currScore = ForeSightProvider.getBestCapture(gameInfo, piece1, move.from, move.to);
							currCapturedByScore = piece1Score;
						}

					}
					if (currScore >= currBestScore && currCapturedByScore < currBestCapturedByScore) {
						currBestScore = currScore;
						currBestCapturedByScore = currCapturedByScore;
						currBestMove = move.from + "-" + move.to;
					}
				}
				nonAttackingMoves.forEach(getMoveWithBestScore);
				let finalScore = (currBestScore*0.7);

				return {score: (currBestScore*0.7), move: currBestMove};
			} else {
				return {score: -1, move: null}
			}
	}

	static getOpponentBestAttackingMove(gameInfo) {
		let currFen = gameInfo.fen();
		var flippedFen = null;
		var tempFen = null;
		if (gameInfo.turn() === 'w') {
			// change turn to b
			tempFen = currFen.replace('w', 'b');
		} else {
			// change turn to w
			tempFen = currFen.replace(' b ', ' w '); // spaces since white bishop is also represented by b
		}
		let tempFenArr = tempFen.split(' ');
		tempFenArr[3] = '-';
		flippedFen = tempFenArr.join(' ');
		var futureGame = new Chess();
		let loadRes = futureGame.load(flippedFen);
		if (!loadRes) {
			throw 'Could not flip turn. orig FEN, flipped FEN: ' + currFen + ' , ' + flippedFen;			
		}
		return AttackingMoveGenerator.getBestAttackingMove(futureGame);	
	}
}