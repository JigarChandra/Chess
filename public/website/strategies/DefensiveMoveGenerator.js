import AttackingMoveGenerator from './AttackingMoveGenerator.js';
import PieceInfoGenerator from './PieceInfoGenerator.js';
import ForeSightProvider from './ForeSightProvider.js';
import ShieldMoveGenerator from './ShieldMoveGenerator.js';
import NonVulnerableMoveGenerator from './NonVulnerableMoveGenerator.js';

export default class DefensiveMoveGenerator {
	/*
	Gets a move that results in the avoidance of capture of the most valuable piece on the next turn either
	by capturing the attacker with a net-profit or moving the vulnerable piece to a non-vulnerable position
	TODO: 1. While moving the vulnerable piece to a non-vulnerable position, give preference to a position
		  whereby it supports another most valuable vulnerable piece
	      2. Also consider a case where two valuable pieces may be simultaneously vulnerable by the same attacker
	      in which case can move one of the vulnerable pieces to check the opponent-king and protect the other
	      vulnerable piece on the next turn

	Excellent e.g: 
	4kb1r/2pqpppp/2pp1n1r/5P2/pPb1P3/P1NP3P/2P2KP1/RNBQ3R b k - 0 22
	white-pawn moves from d2 to d3 and can capture either bishop at c4 or rook at h6 in which
	case DefensiveMoveGenerator chooses to protect rook by moving it to h5 where although it is vulnerable to
	white-queen at d1, it has knight support from f6
	*/
	static getBestDefendingMove(gameInfo) {
			function isAttackingMove(move) {
				return move.flags.includes("c");
			}
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

			var attackingMoves = futureGame.moves({verbose:true}).filter(isAttackingMove);

			if (attackingMoves.length > 0) {
				var attackerScore = -1;
				var attackerPos = null;
				var vulnerablePieceScore = -1;
				var vulnerablePiecePos = null;
				var currBestScore = -1;
				var currBestMove = null;
				function getMoveWithBestScore(move) {
					let piece1 = move.piece, piece2 = move.captured;
					let piece1Score = PieceInfoGenerator.generateScore(piece1), piece2Score = PieceInfoGenerator.generateScore(piece2);
					var damage = 0;
					if (ForeSightProvider.canGetCaptured(futureGame, move.from, move.to)) {
						damage = piece1Score;
					}
					let currScore = (piece2Score - damage);
					if (currScore > currBestScore) {
						currBestScore = currScore;
						attackerScore = piece1Score;
						attackerPos = move.from;
						vulnerablePieceScore = piece2Score;
						vulnerablePiecePos = move.to;
					}
				}
				attackingMoves.forEach(getMoveWithBestScore);

				if (currBestScore > -1) {
					var bestAttackingMoves = [];

					let bestAttackingMoveAttacker = AttackingMoveGenerator.getBestAttackingMove(gameInfo, attackerPos);
					// console.log('bestAttackingMoveAttacker: ' + JSON.stringify(bestAttackingMoveAttacker));
					if (bestAttackingMoveAttacker.score > 0 && !exposesValuablePiece(bestAttackingMoveAttacker.move)) {
						bestAttackingMoves.push(bestAttackingMoveAttacker);
						// console.log('returning move to capture attacking piece');
						return {score: (currBestScore + bestAttackingMoves[0].score), move: bestAttackingMoves[0].move};
					}

					let bestAttackingMove = AttackingMoveGenerator.getBestAttackingMove(gameInfo, null, vulnerablePiecePos);
					// console.log('bestAttacking move, score: ' + bestAttackingMove.move + ',' + bestAttackingMove.score);
					if (bestAttackingMove.score > 0) {
						bestAttackingMoves.push(bestAttackingMove);
					}
					let nextBestAttackingMove = AttackingMoveGenerator.getNextBestAttackingMove(gameInfo, vulnerablePiecePos);
					// console.log('nextBestAttacking move, score: ' + nextBestAttackingMove.move + ',' + nextBestAttackingMove.score);
					if (nextBestAttackingMove.score > 0) {
						bestAttackingMoves.push(nextBestAttackingMove);
					}
					if (bestAttackingMoves.length === 1) {
						// console.log('returning 1');
						return {score: (currBestScore + bestAttackingMoves[0].score), move: bestAttackingMoves[0].move};
					} else if (bestAttackingMoves.length > 1) {
						if (bestAttackingMoves[0].score > bestAttackingMoves[1].score) {
							// console.log('returning 2');
							return {score: (currBestScore + bestAttackingMoves[0].score), move: bestAttackingMoves[0].move};
						} else {
							// console.log('returning 3');
							return {score: (currBestScore + bestAttackingMoves[1].score), move: bestAttackingMoves[1].move};
						}
					}
					if (attackerScore != 8) {
						// Shielding cannot be done against knight
						let shieldMove = ShieldMoveGenerator.getBestShieldingMove(gameInfo, attackerPos, vulnerablePiecePos);
						if (shieldMove != null) {
							// console.log('returning shield move');
							return {score: vulnerablePieceScore, move: shieldMove};
						}
					}
					function exposesValuablePiece(move) {
						const futGame = new Chess();
						futGame.load(gameInfo.fen());
						futGame.move(move, {sloppy: true});
						if (AttackingMoveGenerator.getBestAttackingMove(futGame).score > currBestScore) {
							// console.log('Aborting defense move for current piece as it exposes a more valuable piece');
							// TODO: Return a non vulnerable move NOT with the current piece
							return true;
						}
					}
					let bestNonVulnerableMove = NonVulnerableMoveGenerator.getBestNonVulnerableMove(gameInfo, vulnerablePiecePos, true);
					if (bestNonVulnerableMove != null && !exposesValuablePiece(bestNonVulnerableMove)) {
						// console.log('returning 4');
						return {score: vulnerablePieceScore, move: bestNonVulnerableMove};
					}
					// take out atleast some opposing piece before getting captured
					if (bestAttackingMove.move != null) {
						if (exposesValuablePiece(bestAttackingMove.move)) {
							// console.log('Aborting defense move for current piece as it exposes a more valuable piece');
							// TODO: Return a non vulnerable move NOT with the current piece
							// console.log('exposes valuable piece');
							return {score: -1, move: null};
						}
						// make most impact before getting captured
						// console.log('returning 5');
						return {score: vulnerablePieceScore, move: bestAttackingMove.move};	
					}

					// find worst opponent attacking move
					let worstPos = DefensiveMoveGenerator.getWorstOpponentAttackingPos(gameInfo, vulnerablePiecePos);
					if (worstPos != null) {
						if (exposesValuablePiece(vulnerablePiecePos + '-' + worstPos)) {
							// console.log('Aborting move as it exposes another valuable piece');
							return {score: -1, move: null};
						}
						// console.log('returning 6');
						return {score: vulnerablePieceScore, 
						move: vulnerablePiecePos + '-' + DefensiveMoveGenerator.getWorstOpponentAttackingPos(gameInfo, vulnerablePiecePos)};
					}

					// TODO: find a supporting piece-move in a non vulnerable pos
					let validMoves = gameInfo.moves({verbose:true});
					var currBestSupportMovePieceScore = Number.MAX_SAFE_INTEGER, currBestSupportMove;
					validMoves.forEach(function(move) {
						let supportTester = new Chess();
						supportTester.load(gameInfo.fen());
						supportTester.move(move);
						let oppAtttackingMoveAfterSupport = AttackingMoveGenerator.getBestAttackingMove(supportTester);
						if (oppAtttackingMoveAfterSupport.score < currBestScore) {
							let piece = move.piece,
								score = PieceInfoGenerator.generateScore(piece);
								if (score < currBestSupportMovePieceScore) {
									currBestSupportMovePieceScore = score;
									currBestSupportMove = move.from + '-' + move.to;
								}
						}
					});
					if (currBestSupportMove) {
						return {score: vulnerablePieceScore, move: currBestSupportMove};
					}
				}
				// console.log('returning 7');
				return {score: -1, move: null};
			} else {
				// console.log('returning 8');
				return {score: -1, move: null};
			}
	}

	/*
	Finding a position where piece at 'from' can move to, which results in least damage
	*/
	static getWorstOpponentAttackingPos(gameInfo, from) {
			function isValidMove(move) {
				return move.from === from;
			}
			var worstCaptureScore = 20; // cannot be higher than King's score
			var worstPos = null;
			function updateWorstScoreAndPos(move) {
				gameInfo.move(move);
				let attackingMove = AttackingMoveGenerator.getBestAttackingMove(gameInfo, move.to);
				if (attackingMove.score < worstCaptureScore) {
					worstCaptureScore = attackingMove.score;
					worstPos = move.to;
				}
				gameInfo.undo();
			}

			let validMoves = gameInfo.moves({verbose:true}).filter(isValidMove);
			validMoves.forEach(updateWorstScoreAndPos);
			return worstPos;
	}
}