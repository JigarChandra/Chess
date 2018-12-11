class TwoStepCheckMateMoveGenerator {

	static getTwoStepCheckMateMove(gameInfo) {
			function isValidMove(move) {
				return (! move.flags.includes('e'));
			}

			let oneStepCheckMateMove = TwoStepCheckMateMoveGenerator.getCheckMateMoveInOneTurn(gameInfo);
			if(oneStepCheckMateMove != null) {
				return {score: (13), move: oneStepCheckMateMove};
			}

			var nonAttackingMoves = NonVulnerableMoveGenerator.getNonVulnerableMoves(gameInfo).saferMoves;
			var checkMateMove = null;
			if (nonAttackingMoves && nonAttackingMoves.length > 0) {
				for(var i = 0; i < nonAttackingMoves.length; i++) {
					let move = nonAttackingMoves[i];
					let fen = gameInfo.fen();
					let futureGame = new Chess(fen);

					let removedPiece = futureGame.remove(move.from);
					if (removedPiece === null) {
						throw 'Could not remove piece at: ' + move.from;
					}
					let res = futureGame.put(removedPiece, move.to);
					if (res === false) {
						throw 'Invalid move from,to: ' + from + "," + to;
					}
					if (TwoStepCheckMateMoveGenerator.getCheckMateMove(futureGame, move) != null) {
						checkMateMove = move;
					}
					if (checkMateMove != null) {
					return {score: (13), move: (checkMateMove.from + '-' + checkMateMove.to)};	
					}
				}
				return {score: -1, move: null};
			} else {
				return {score: -1, move: null}
			}
	}

	static getCheckMateMoveInOneTurn(gameInfo) {
		let allMoves = gameInfo.moves();
		for (var i = 0; i < allMoves.length; i++) {
			gameInfo.move(allMoves[i])
			if (gameInfo.in_checkmate()) {
				console.log('CheckMate through one move will be: ' + allMoves[i]);
				return allMoves[i];
			} else {
				gameInfo.undo();
			}
		}
		return null;
	}

	static getCheckMateMove(gameInfo, move) {
		let allMoves = gameInfo.moves();
		for (var i = 0; i < allMoves.length; i++) {
			let currMove = allMoves[i];
			let fen = gameInfo.fen();
			let futureGame = new Chess(fen);
			let moveRes = futureGame.move(currMove);
			if (moveRes === null) {
				throw 'Error while making move: ' + currMove
			}
			if (futureGame.in_checkmate()) {
				console.log('TwoStepCheckMate finishing move will be: ' + move.from + '-' + move.to + ',' + currMove);
				return currMove;
			}
		}
		return null;
	}
}