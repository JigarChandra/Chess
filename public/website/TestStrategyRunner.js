class TestStrategyRunner {
	
	static run (Player1Strategy, Player2Strategy, gameEngine) {
		var selectedMove = null;
		var isGameOver =  function () {
			return (gameEngine.game_over() === true ||
    				gameEngine.in_draw() === true ||
    				gameEngine.moves().length === 0);
		}
		if (! isGameOver()) {
			var currPlayerStrategy = null;
			if (gameEngine.turn() === 'w') {
				//console.log('Player 1, turn:' + StrategyRunner.numberOfMoves);
				selectedMove = Player1Strategy.move(gameEngine);
				//console.log('FEN: ' + gameEngine.fen());
				//console.log('Player 1 move: ' + selectedMove);
			} else {
				//console.log('Player 2, turn:' + StrategyRunner.numberOfMoves);
				selectedMove = Player2Strategy.move(gameEngine);
				//console.log('FEN: ' + gameEngine.fen());
				//console.log('Player 2 move: ' + selectedMove);
			}
		} else {
			//console.log('Game ended');
			return;
		}
		// if (StrategyRunner.numberOfMoves > 10 && StrategyRunner.numberOfMoves < 15) {
		// 	console.log(gameEngine.moves({verbose:true})); // temp test code
		// }
		let res = gameEngine.move(selectedMove, {sloppy: true});
  		// window.setTimeout(StrategyRunner.run, 2000, Player1Strategy, Player2Strategy, gameEngine, board);
	}
	
}