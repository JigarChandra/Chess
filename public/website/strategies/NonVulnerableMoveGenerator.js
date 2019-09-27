/*
Find possible moves from vulnerablePiecePos and returns a random pos where it cannot be immediately captured
*/
import AttackingMoveGenerator from './AttackingMoveGenerator.js';
import PieceInfoGenerator from './PieceInfoGenerator.js';
import ForeSightProvider from './ForeSightProvider.js';

export default class NonVulnerableMoveGenerator {

	static getBestNonVulnerableMove(gameInfo, fromPos, isDefensive) {
		let moves = NonVulnerableMoveGenerator.getNonVulnerableMoves(gameInfo, fromPos, isDefensive);
		// console.log('non vul moves: ' + JSON.stringify(moves));
			if (moves.saferMoves && moves.saferMoves.length > 0) {
				let developingMoves = NonVulnerableMoveGenerator.getDevelopingNonVulnerableMoves(gameInfo, moves.saferMoves);
				if(developingMoves.length > 0) {
					let idx = Math.floor(Math.random() * developingMoves.length);
					return (developingMoves[idx].from + '-' + developingMoves[idx].to);
				}

				let idx = Math.floor(Math.random() * moves.saferMoves.length);
				return (moves.saferMoves[idx].from + '-' + moves.saferMoves[idx].to);
			}

			if (moves.safeMoves && moves.safeMoves.length > 0) {
				let idx = Math.floor(Math.random() * moves.safeMoves.length);
				return (moves.safeMoves[idx].from + '-' + moves.safeMoves[idx].to);
			}

			return null;
	}

	static getNonVulnerableMoves(gameInfo, fromPos, isDefensive) {
		function isNonCaptureMove(move) {
			if (typeof fromPos === 'string') {
				return (move.flags.includes("n") && move.from === fromPos);
			}
			return ((move.flags.includes("n")) || (move.flags.includes("b")));
		}
		function hasNotOccurredRecently(from, to) {
			let pastMoves = gameInfo.history({verbose: true});
			if (pastMoves.length < 4) {
				return true;
			}
			for(var i = pastMoves.length - 4; i < pastMoves.length; i++) {
				if(pastMoves[i].from === from && pastMoves[i].to === to) {
					return false;
				}
			}
			return true;
		}
		let currOpponentBestAttackingMove = AttackingMoveGenerator.getOpponentBestAttackingMove(gameInfo);
		// console.log('currOpponentBestAttackingMove: ' + JSON.stringify(currOpponentBestAttackingMove));
		var saferMoves = [];
		var nonCapturingMoves = gameInfo.moves({verbose:true}).filter(isNonCaptureMove);
			if (nonCapturingMoves.length > 0) {
				var currBestScore = -1;
				var currBestMove = null;
				var safeMoves = [];
				for (var i = 0; i < nonCapturingMoves.length; i++) {
					var futureGame = new Chess(gameInfo.fen());
					let futureMove = nonCapturingMoves[i].from + '-' + nonCapturingMoves[i].to;
					let futMoveRes = futureGame.move(nonCapturingMoves[i].from + '-' + nonCapturingMoves[i].to, {sloppy: true});

					let futureOpponentBestAttackingMove = AttackingMoveGenerator.getBestAttackingMove(futureGame);
					if (nonCapturingMoves[i].from === 'g7' && nonCapturingMoves[i].to === 'e5') {
						console.log('debugging');
					}
					// need to ensure a perfectly safe non-vulnerable move if a piece needs to be defended
					if ((futureOpponentBestAttackingMove.score < currOpponentBestAttackingMove.score && !isDefensive) 
						|| futureOpponentBestAttackingMove.score <= 0
						|| (!(ForeSightProvider.canGetCaptured(gameInfo, nonCapturingMoves[i].from, nonCapturingMoves[i].to)) && isDefensive)) {
						let futureOpponentNextBestAttackingMove = AttackingMoveGenerator.getNextBestAttackingMove(futureGame),
						futureOpponentNextBestAttackingMovePos = futureOpponentNextBestAttackingMove.move ? futureOpponentNextBestAttackingMove.move.split('-')[1] : null;

						if (futureOpponentNextBestAttackingMovePos) {
							const futureGame1 = new Chess(futureGame.fen());
							futureGame1.move(futureOpponentNextBestAttackingMove.move, {sloppy: true})
							let currFen = futureGame1.fen();
							var flippedFen = null;
							var tempFen = null;
							if (futureGame1.turn() === 'w') {
								// change turn to b
								tempFen = currFen.replace('w', 'b');
							} else {
							// change turn to w
							tempFen = currFen.replace(' b ', ' w '); // spaces since white bishop is also represented by b
							}
							let tempFenArr = tempFen.split(' ');
							tempFenArr[3] = '-';
							flippedFen = tempFenArr.join(' ');
							var futureGame2 = new Chess();
							let loadRes = futureGame2.load(flippedFen);
							let futureOpponentBestAttackingMove1 = AttackingMoveGenerator.getBestAttackingMove(futureGame2, null, futureOpponentNextBestAttackingMovePos),
							futureOpponentNextBestAttackingMovePos1 = futureOpponentBestAttackingMove1.move ? futureOpponentBestAttackingMove1.move.split('-')[1] : null;

							const isTargetOnNextAttackingMove = (futureOpponentNextBestAttackingMovePos1 === nonCapturingMoves[i].to);
							if (!isTargetOnNextAttackingMove) {
								saferMoves.push({from: nonCapturingMoves[i].from, to:nonCapturingMoves[i].to, piece: nonCapturingMoves[i].piece});
							}
						} else {
							saferMoves.push({from: nonCapturingMoves[i].from, to:nonCapturingMoves[i].to, piece: nonCapturingMoves[i].piece});
						}
						// console.log('futureMove: ' + futureMove);
						// console.log('was successful: ' + futMoveRes);
						// console.log('futureOpponentBestAttackingMove: ' + JSON.stringify(futureOpponentBestAttackingMove));
					}

					if (futureOpponentBestAttackingMove.score <= -1) {
						safeMoves.push({from: nonCapturingMoves[i].from, to:nonCapturingMoves[i].to, piece: nonCapturingMoves[i].piece});
					}
				}
				return {saferMoves: saferMoves, safeMoves:safeMoves};
			}
		return {};
	}

	/*
	Finding a forward move that can either support another piece or moves least developed piece
	1. Find pawns that can support another piece
	2. Find forward moves giving higher weight to least behind pieces except king and least weight to bigger jumps
	*/
	static getDevelopingNonVulnerableMoves(gameInfo, safeMoves) {
		function isPawnMove(move) {
			return PieceInfoGenerator.generateType(move.piece) === gameInfo.PAWN;
		}

		function isNotPawnMove(move) {
			return PieceInfoGenerator.generateType(move.piece) != gameInfo.PAWN;
		}

		function isNotKingMove(move) {
			return PieceInfoGenerator.generateType(move.piece) != gameInfo.KING;
		}
		function isKingMove(move) {
			return PieceInfoGenerator.generateType(move.piece) === gameInfo.KING;
		}

		var weightMoves = [];
		var isWhiteTurn = false;
		if (gameInfo.turn() === 'w') {
			isWhiteTurn = true;
		}
		function isSupportingMove(move) {
			let supportingPos = getSupportingPositions(move.to);
			for (var i = 0; i < supportingPos.length; i++) {
				let piece = gameInfo.get(supportingPos[i]);
				if (piece != null && piece.color === gameInfo.turn()) {
					return true;
				}
			}
			return false;
		}
		function getSupportingPositions(pos) {
			var suportingPosRow = parseInt(pos.charAt(1)) - 1;
			if (isWhiteTurn) {
				suportingPosRow += 2;
			}
			var supportingPosCols = [];
			var supportingPos = [];
			let posCol = pos.charAt(0);
			if (posCol == 'a') {
				supportingPosCols.push('b');
			} else if (posCol == 'h') {
				supportingPosCols.push('g');
			} else {
				supportingPosCols.push(String.fromCharCode(posCol.charCodeAt(0) -1));
				supportingPosCols.push(String.fromCharCode(posCol.charCodeAt(0) +1));
			}
			for (var i = 0; i < supportingPosCols.length; i++) {
				supportingPos.push(supportingPosCols[i] + suportingPosRow);
			}
			return supportingPos;
		}
		var weightedMoves = [];
		let pawnMoves = safeMoves.filter(isPawnMove);
		for(var i = 0; i < pawnMoves.length; i++) {
			if(isSupportingMove(pawnMoves[i])) {
				for(var j = 0; j < 4; j++) {
					weightedMoves.push(pawnMoves[i]);
				}
			} else {
				for(var j = 0; j < 2; j++) {
					weightedMoves.push(pawnMoves[i]);
				}
			}
		}

		var needsToMoveUp = false;
		function getOppKingRow() {
			let turnColor = gameInfo.turn();
			var oppKingColor = 'b';
			if (turnColor === 'b') {
				oppKingColor = 'w';
			}
			var oppKingNotation = 'K';
			if (oppKingColor === 'w') {
				oppKingNotation = oppKingNotation.toLowerCase();
			}
			let rows = gameInfo.fen().split(' ')[0].split('/');
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].includes(oppKingNotation)) {
					return i+1;
				}
			}
			throw 'Could not find opposition king position row'
		}
		function isDevelopingTowardsOppKing(move) {
			//console.log('Evaluating move developing towards king: ' + JSON.stringify(move));
			let oppKingRow = getOppKingRow();
			var shouldMoveUp = false;
			if (parseInt(move.from.charAt(1)) < oppKingRow) {
				shouldMoveUp = true;
			}
			var isDeveloping;
			if (shouldMoveUp) {
				isDeveloping = (parseInt(move.from.charAt(1)) < parseInt(move.to.charAt(1)));
			} else {
				isDeveloping = (parseInt(move.from.charAt(1)) > parseInt(move.to.charAt(1)));
			}
			//console.log('is developing: ' + isDeveloping);
			return isDeveloping;
		}

		var nonPawnMoves = safeMoves.filter(isNotPawnMove);
		if (safeMoves.filter(isNotKingMove).length) {
			//console.log('has non king moves');
			// avoid king movements if there are other options
			nonPawnMoves = nonPawnMoves.filter(isNotKingMove);
		}
		else {
			//console.log('has only king moves');
		}

		for (var i =0; i < nonPawnMoves.length; i++) {
			var weight = 0;
			// discourage king movements
			if (isNotKingMove(nonPawnMoves[i]) && isDevelopingTowardsOppKing(nonPawnMoves[i])) {
				weight += 2;
				let distance = Math.abs(parseInt(nonPawnMoves[i].from.charAt(1)) - parseInt(nonPawnMoves[i].to.charAt(1)));
				let distanceBasedWeight = 7 - distance; // encourages smaller steps
				weight += distanceBasedWeight;
			}
			for (var j = 0; j < weight; j++) {
				weightedMoves.push(nonPawnMoves[i]);
			}
		}
		return weightedMoves;
	}
}