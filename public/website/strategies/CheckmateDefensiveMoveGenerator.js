import TwoStepCheckMateMoveGenerator from './TwoStepCheckMateMoveGenerator.js';

export default class CheckmateDefensiveMoveGenerator {
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
			var oppCheckmateMove = TwoStepCheckMateMoveGenerator.getTwoStepCheckMateMove(futureGame);
			if (oppCheckmateMove.move !== null) {
				console.log('opponent will end game with checkmate move: ' + oppCheckmateMove.move);
			}
			
			return {score: -1, move: null};
	}

}