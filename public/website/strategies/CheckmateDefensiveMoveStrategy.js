import CheckmateDefensiveMoveGenerator from './CheckmateDefensiveMoveGenerator.js';

export default class CheckmateDefensiveMoveStrategy {
	move(gameInfo) {
		var res = CheckmateDefensiveMoveGenerator.getBestDefendingMove(gameInfo);
		res.strategy = 'CheckMateDefense'
		return res;
		// TODO: implement ii & iii
	}
}