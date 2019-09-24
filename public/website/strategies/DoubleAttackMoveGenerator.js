import PieceInfoGenerator from './PieceInfoGenerator.js';
import AttackingMoveGenerator from './AttackingMoveGenerator.js';

export default class DoubleAttackMoveGenerator {

	static getDoubleAttackingMove(gameInfo) {
		var currBestAttack = {
			score: -1,
			move: null
		};
		const currOppBestAttackingMove = AttackingMoveGenerator.getOpponentBestAttackingMove(gameInfo),
		allMoves = gameInfo.moves({verbose: true});
		allMoves.forEach(function(move) {
			//if (move.to === 'e4') {
			//	console.log('debugging');
			//}
			const to = move.to,
			temp = new Chess(gameInfo.fen());
			temp.move(move);
			let currFen = temp.fen();
			var flippedFen = null;
			var tempFen = null;
			if (temp.turn() === 'w') {
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
			const futAllMoves = futureGame.moves({verbose: true}),
			captureMovesFromToPos = futAllMoves.filter(m => {
				const mv = AttackingMoveGenerator.getBestAttackingMove(futureGame, m.to, m.from);
				//if (m.from === to && m.flags.includes('c')) {
				//	console.log('attacking move');
				//}
				return m.from === to &&
				mv.score > 0;
			});
			if (captureMovesFromToPos.length < 2) {
				return;
			}
			if (AttackingMoveGenerator.getBestAttackingMove(temp, to).score < 0 &&
			AttackingMoveGenerator.getBestAttackingMove(temp).score <= currOppBestAttackingMove.score) {
				const highestScore = captureMovesFromToPos.reduce(function(acc, currMove) {
					const score = PieceInfoGenerator.generateScore(currMove.captured);
					return score > acc ? score : acc;
				}, 0);
				if (highestScore > currBestAttack.score) {
					currBestAttack.score = highestScore;
					currBestAttack.move = move;
				}
			}
		});
		return currBestAttack;
	}
}