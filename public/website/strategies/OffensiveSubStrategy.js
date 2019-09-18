import AttackingMoveGenerator from './AttackingMoveGenerator.js';

export default class OffensiveSubStrategy {
	move(gameInfo) {
		var res = AttackingMoveGenerator.getBestAttackingMove(gameInfo);
		res.strategy = 'Offensive'
		return res;
		// TODO: implement ii & iii
	}
}