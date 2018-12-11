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
// ******** Need a Defensive strategy against possible check-mate moves from opponent;
// import {RandomSubStrategy} from './RandomSubStrategy.js';

class DACandOffensiveAndNextOffensiveAndDefensiveAndRandomStrategy {
	move(gameInfo) {
		let strategies = [new DefenseAgainstCheckSubStrategy(), new OffensiveSubStrategy(),
						  new DefensiveSubStrategy(), new NextOffensiveSubStrategy(),
						  new TwoStepCheckMateSubStrategy(),
						  new NonVulnerableSubStrategy(), new RandomSubStrategy(new RandomStrategy())];
		var currBestScore = -1;
		var currBestMove = null;
		var currBestStrategy = null;
		for (var i = 0; i < strategies.length; i++) {
			let currStrategy = strategies[i].move(gameInfo);
			let currScore = currStrategy.score, currMove = currStrategy.move;
			// console.log('BestScore, currScore, currStrategy, move: ' + currBestScore + ' ' + currScore + ' ' + currStrategy.strategy + ' ' + currMove);
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