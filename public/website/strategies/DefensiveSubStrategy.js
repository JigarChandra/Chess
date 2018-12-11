class DefensiveSubStrategy {
	move(gameInfo) {
		var res = DefensiveMoveGenerator.getBestDefendingMove(gameInfo);
		res.strategy = 'Defensive'
		return res;
		// TODO: implement ii & iii
	}
}