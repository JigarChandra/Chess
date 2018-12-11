class RandomSubStrategy {
	constructor(randomStrategy) {
		this.randomStrategy = randomStrategy;
	}
	move(gameInfo, randomStrategy) {
		return {score: 0, move: this.randomStrategy.move(gameInfo), strategy: 'Random'};
	}
}