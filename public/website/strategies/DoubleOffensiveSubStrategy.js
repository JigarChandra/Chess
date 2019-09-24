import DoubleAttackMoveGenerator from './DoubleAttackMoveGenerator.js';

export default class DoubleOffensiveSubStrategy {
	move(gameInfo) {
		var res = DoubleAttackMoveGenerator.getDoubleAttackingMove(gameInfo);
		res.strategy = 'DoubleOffensive'
		return res;
	}
}