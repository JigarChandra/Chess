import NextAttackingMoveGenerator from './NextAttackingMoveGenerator.js';

export default class NextOffensiveSubStrategy {
	move(gameInfo) {
		var res = NextAttackingMoveGenerator.getNextBestAttackingMove(gameInfo);
		res.strategy = 'NextOffensive'
		return res;
		// TODO: implement ii & iii
	}
}