class TwoStepCheckMateSubStrategy {
	move(gameInfo) {
		var res = TwoStepCheckMateMoveGenerator.getTwoStepCheckMateMove(gameInfo);
		res.strategy = 'TwoStepCheckMate'
		return res;
		// TODO: implement ii & iii
	}
}