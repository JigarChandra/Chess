import DefenseAgainstCheckSubStrategy from './DefenseAgainstCheckSubStrategy.js';
import DoubleOffensiveSubStrategy from './DoubleOffensiveSubStrategy.js';
import OffensiveSubStrategy from './OffensiveSubStrategy.js';
import DefensiveSubStrategy from './DefensiveSubStrategy.js';
import TwoStepCheckMateSubStrategy from './TwoStepCheckMateSubStrategy.js';
import CheckmateDefensiveMoveStrategy from './CheckmateDefensiveMoveStrategy.js';
import NextOffensiveSubStrategy from './NextOffensiveSubStrategy.js';
import NonVulnerableSubStrategy from './NonVulnerableSubStrategy.js';
import RandomSubStrategy from './RandomSubStrategy.js';
import RandomStrategy from './RandomStrategy.js';

export default class WithCheckMateDefense {
	move(gameInfo) {
		let strategies = [new DefenseAgainstCheckSubStrategy(), 
						  new DoubleOffensiveSubStrategy(),
						  new OffensiveSubStrategy(),
						  new DefensiveSubStrategy(),
						  new TwoStepCheckMateSubStrategy(),
						  new CheckmateDefensiveMoveStrategy(),
						  new NextOffensiveSubStrategy(),
						  new NonVulnerableSubStrategy(), new RandomSubStrategy(new RandomStrategy())];
		var currBestScore = -1;
		var currBestMove = null;
		var currBestStrategy = null;
		for (var i = 0; i < strategies.length; i++) {
			let currStrategy = strategies[i].move(gameInfo);
			console.log(`Strategy: ${currStrategy.strategy} , Move: ${JSON.stringify(currStrategy.move)} , Score: ${currStrategy.score}`);
			let currScore = currStrategy.score, currMove = currStrategy.move;
			// to execute immediate attacking / defending moves
			if (currStrategy.strategy === 'NextOffensive' && currBestScore > 0) {
				continue;
			}
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
		
		return {move: currBestMove, strategy: currBestStrategy};
	}
}