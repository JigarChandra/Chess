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

					let futureGameWithMove = new Chess();
					futureGameWithMove.load(futureGame.fen());
					let removedPiece = futureGameWithMove.remove(move.from);
					let putRes = futureGameWithMove.put(removedPiece, move.to);
					let bestOppMoveAfterFirstMove = AttackingMoveGenerator.getBestAttackingMove(futureGameWithMove, move.to);

					if ((bestOppMoveAfterFirstMove.score <= currOpponentBestAttackingMove.score 
						 && !ForeSightProvider.canGetCaptured(gameInfo, move.from, move.to)
						 ) || (bestOppMoveAfterFirstMove.score < 0)) {

						// let futGame = new Chess(gameInfo.fen());
						// futGame.move(move.from + '-' + move.to, {sloppy: true});
						// let opponentBestAttackingMove = AttackingMoveGenerator.getBestAttackingMove(futGame);

						// ensure that this move does not make any other piece vulnerable
							// currScore = ForeSightProvider.getBestCapture(gameInfo, piece1, move.from, move.to);
							const futGameAtt = new Chess();
							futGameAtt.load(gameInfo.fen());
							let removedPiece = futGameAtt.remove(move.from);
							if (removedPiece === null) {
								throw 'Could not remove piece at: ' + move.from;
							}
							let res = futGameAtt.put(removedPiece, move.to);

							if (res === false) {
								throw 'Invalid move from,to: ' + move.from + "," + move.to;
							}
							const currMove = AttackingMoveGenerator.getBestAttackingMove(futGameAtt, null, move.to);
							currScore = currMove.score;
							currCapturedByScore = piece1Score;
							// console.log('first move fen: ' + futGameAtt.fen());
							// console.log('first move from, to: ' + move.from + ' , ' + move.to);
							// console.log('currMove: ' + JSON.stringify(currMove));

					}
					else {
						// console.log('Skipping next offensive via from, to due to imminent capture by opponent: '
						//  + move.from + ' , ' + move.to + ' , ' + JSON.stringify(bestOppMoveAfterFirstMove));
					}

					if (currScore >= currBestScore) {
						if (currScore === currBestScore) {
							if (currCapturedByScore <= currBestCapturedByScore) {
								currBestScore = currScore;
								currBestCapturedByScore = currCapturedByScore;
								currBestMove = move.from + "-" + move.to;		
							}
						}
						currBestScore = currScore;
						currBestCapturedByScore = currCapturedByScore;
						currBestMove = move.from + "-" + move.to;
						// console.log('currScore, currBestScore, currCapturedByScore, currBestCapturedByScore: ' 
						// 	+ currScore + ' , ' + currBestScore + ' , ' + currCapturedByScore + ' , ' + currBestCapturedByScore);
						// console.log('currBestMove: ' + currBestMove);
					}
				}
				nonAttackingMoves.forEach(getMoveWithBestScore);
				let finalScore = (currBestScore*0.7);
				// console.log('Found a move: ' + finalScore + ',' + currBestMove);
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