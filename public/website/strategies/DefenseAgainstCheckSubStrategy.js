/*
Defend against check in preference:
	i. capturing the attacking piece with the least valuable piece (compared to the attacking piece)
	ii. putting up the least valuable piece (compared to the attacking piece) as a shield
	iii. moving the king
*/
import AttackingMoveGenerator from './AttackingMoveGenerator.js';

export default class DefenseAgainstCheckSubStrategy {
	move(gameInfo) {
		if (gameInfo.in_check()) {
			var res = AttackingMoveGenerator.getBestAttackingMove(gameInfo);
			res.strategy = 'DAC';
			return res;
		} else {
			return {score: -1, move: null, strategy: 'DAC'}
		}
		// TODO: implement ii & iii
	}
}