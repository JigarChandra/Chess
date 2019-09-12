class CheckmateDefensiveMoveStrategy {
	move(gameInfo) {
		var res = CheckmateDefensiveMoveGenerator.getBestDefendingMove(gameInfo);
		res.strategy = 'TwoStepCheckMate'
		return res;
		// TODO: implement ii & iii
	}
}