class DACandDefensiveAndRandomStrategy {
	move(gameInfo) {
		let strategies = [new DefenseAgainstCheckSubStrategy(), new OffensiveSubStrategy(),
						  new NonVulnerableSubStrategy(), new DefensiveSubStrategy(), new RandomSubStrategy(new RandomStrategy())];
		var currBestScore = -1;
		var currBestMove = null;
		var currBestStrategy = null;
		for (var i = 0; i < strategies.length; i++) {
			let currStrategy = strategies[i].move(gameInfo);
			let currScore = currStrategy.score, currMove = currStrategy.move;
			if (currScore > currBestScore) {
				currBestScore = currScore;
				currBestMove = currMove;
				currBestStrategy = currStrategy.strategy;
			}
		}
		if (gameInfo.turn() === 'w') {
			console.log('Player 1 strategy: ' + currBestStrategy);
		} else {
			console.log('Player 2 strategy: ' + currBestStrategy);
		}
		
		return currBestMove;
	}
}