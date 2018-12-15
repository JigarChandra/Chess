class MovesUtil {
	static isInThreeFold(gameInfo, from, to) {
		gameInfo.move(from + "-" + to, {sloppy: true});
		if (gameInfo.in_threefold_repetition()) {
			console.log('Is three fold');
			gameInfo.undo();
			return true;
		} else {
			gameInfo.undo();
			return false;
		}
	}
}