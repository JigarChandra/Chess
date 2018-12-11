class NextOffensiveSubStrategy {
	move(gameInfo) {
		var res = AttackingMoveGenerator.getNextBestAttackingMove(gameInfo);
		res.strategy = 'NextOffensive'
		return res;
		// TODO: implement ii & iii
	}
}