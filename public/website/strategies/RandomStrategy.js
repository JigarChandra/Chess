class RandomStrategy {
	move(gameInfo) {
		var possibleMoves = gameInfo.moves();
		var randomIndex = Math.floor(Math.random() * possibleMoves.length);
		return possibleMoves[randomIndex];
	}
}