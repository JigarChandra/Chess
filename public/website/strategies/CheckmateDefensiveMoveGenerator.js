import TwoStepCheckMateMoveGenerator from './TwoStepCheckMateMoveGenerator.js';
import ShieldMoveGenerator from './ShieldMoveGenerator.js';
import PieceInfoGenerator from './PieceInfoGenerator.js';

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
			if (oppCheckmateMove.move === null) {
				return {score: -1, move: null};
			}
			console.log('opponent will end game with checkmate move: ' + oppCheckmateMove.move);
			if (oppCheckmateMove.steps !== 1) {
				return {score: -1, move: null};
			}
				/* For a one-step Defensive steps in priority:
				 1. Cut off the move towards the checkmate position (unless it is a knight) 
				ensuring that opp best att score at that pos is <= 0
				 2. Find an attacking move (least valuable) at the pos where the opp will place its piece for the checkmate move
				 3. Move king to any position where checkmate is averted
				*/
			
			 // Cannot block knight moves
			 if (PieceInfoGenerator.generateScore(oppCheckmateMove.move.piece) !== 8) {
				const shieldMove = ShieldMoveGenerator.getBestShieldingMove(gameInfo, oppCheckmateMove.move.from, oppCheckmateMove.move.to);
				if (shieldMove) {
					console.log('Found shield move to block potential one step checkmate');
					return {score: 20, move: shieldMove};
				}
			 }
			 return {score: -1, move: null};
	}

}