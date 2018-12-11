class NonVulnerableSubStrategy {
	move(gameInfo) {
		var res = {};
		res.move = NonVulnerableMoveGenerator.getBestNonVulnerableMove(gameInfo);
		if (res.move === null) {
			res.score = -1
		} else {
			res.score = 1; // to encourage over a random potentially vulnerable move	
		}
		res.strategy = 'NonVulnerable'
		return res;
		// TODO: implement ii & iii
	}
}