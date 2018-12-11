/*
improved move strategy:
1. defend against check in preference:
	i. capturing the attacking piece with the least valuable piece (compared to the attacking piece)
	ii. putting up the least valuable piece (compared to the attacking piece) as a shield
	iii. moving the king
2. Rank offensive vs defensive moves such that:
 	i. offensive move yielding highest points (points by capture - points by losing the attacking piece on next turn if applicable)
 	ii. defensive move preventing a capture on next move in preference:
 		a. rank by position value: queen -> rook -> knight -> bishop -> pawn
 		b. if the attacking piece can be captured with a net profit (i.e defending piece may get captured on next turn)
 		c. else move to a position where it cannot be immediately captured
3. single move to a position where it cannot be captured immediately in preference:
	i. can capture atleast one valuable peice from two more valuable pieces
	ii. can capture atleast one valuable peice
4. two-stage attack with variations:
	i. single piece arriving by two moves at a position where it cannot be captured at either positions and 
5. move at a non-vulnerable position in a preference: knight -> bishop -> rook -> pawn -> queen -> king
**** If the chosen move is illegal, print the move and choose a random move
Logic for assessing cumulative damage by two-stage attack:
take current board FEN
create new board instance with this FEN
execute the attacking move on this new board
check if next set of possible moves contain a capture flag for that position and find the least 

Logic for checking if attacking move results in losing the attacking piece on next turn:
take current board FEN
create new board instance with this FEN
execute the attacking move on this new board
check if next set of possible moves contain a capture flag for that position
*/

class StrategyRunner {
	
	static run (Player1Strategy, Player2Strategy, gameEngine, board, isPlayer1Turn) {
		var selectedMove = null;
		var isGameOver =  function () {
			return (gameEngine.game_over() === true ||
    				gameEngine.in_draw() === true ||
    				gameEngine.moves().length === 0);
		}
		if (! isGameOver()) {
			var currPlayerStrategy = null;
			if (gameEngine.turn() === 'w') {
				console.log('Player 1, turn:' + StrategyRunner.numberOfMoves);
				selectedMove = Player1Strategy.move(gameEngine);
				console.log('FEN: ' + gameEngine.fen());
				console.log('Player 1 move: ' + selectedMove);
			} else {
				console.log('Player 2, turn:' + StrategyRunner.numberOfMoves);
				selectedMove = Player2Strategy.move(gameEngine);
				console.log('FEN: ' + gameEngine.fen());
				console.log('Player 2 move: ' + selectedMove);
			}
		} else {
			console.log('Game ended');
			return;
		}
		// if (StrategyRunner.numberOfMoves > 10 && StrategyRunner.numberOfMoves < 15) {
		// 	console.log(gameEngine.moves({verbose:true})); // temp test code
		// }
		let res = gameEngine.move(selectedMove, {sloppy: true});
  		board.position(gameEngine.fen());

  		StrategyRunner.numberOfMoves+=1; // temp test code
  		// window.setTimeout(StrategyRunner.run, 2000, Player1Strategy, Player2Strategy, gameEngine, board);
	}
	
}