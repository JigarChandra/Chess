class ShieldMoveGenerator {

	static getBestShieldingMove(gameInfo, attackerPos, vulnerablePos) {
			function getTilesInBetween() {
				var inBetweenTiles = [];
				if (attackerPos.charAt(0) === vulnerablePos.charAt(0)) {
					// same column
					let char = attackerPos.charAt(0);
					var min = parseInt(attackerPos.charAt(1)), max = parseInt(vulnerablePos.charAt(1));
					if (min > max) {
						let temp = min;
						min = max;
						max = temp;
					}
					for (var i = min + 1; i < max; i++) {
						inBetweenTiles.push(char + i);
					}
					
				} else if (attackerPos.charAt(1) === vulnerablePos.charAt(1)) {
					let char = attackerPos.charAt(1);
					var min = attackerPos.charAt(0), max = vulnerablePos.charAt(0);
					if (min > max) {
						let temp = min;
						min = max;
						max = temp;
					}
					for (var i = min.charCodeAt(0) + 1; i < max.charCodeAt(0); i++) {
						inBetweenTiles.push(String.fromCharCode(i) + char);
					}	
				} else {
					let char = attackerPos.charAt(1);
					var min = attackerPos.charAt(0), max = vulnerablePos.charAt(0);
					if (min > max) {
						min = vulnerablePos;
						max = attackerPos;
					} else {
						min = attackerPos;
						max = vulnerablePos;
					}
					var curr = min;
					var shouldIncrement = true;
					if (parseInt(min.charAt(1)) > parseInt(max.charAt(1))) {
						shouldIncrement = false;
					}
					var charCode = min.charCodeAt(0);
					var pos = parseInt(min.charAt(1));
					if (shouldIncrement) {
						curr = String.fromCharCode(++charCode) + (++pos);
					} else {
						curr = String.fromCharCode(++charCode) + (--pos);
					}
					while (curr != max) {
						inBetweenTiles.push(curr);
						if (shouldIncrement) {
							curr = String.fromCharCode(++charCode) + (++pos);
						} else {
							curr = String.fromCharCode(++charCode) + (--pos);
						}
					}
				}
				return inBetweenTiles;
			}
			let tilesInBetween = getTilesInBetween();
			for (var i = 0; i < tilesInBetween.length; i++) {
				let currTile = tilesInBetween[i];
				function isValidMove(move) {
					return (move.to === currTile && move.from != vulnerablePos);
				}
				let movesToCurrTile = gameInfo.moves({verbose:true}).filter(isValidMove);
				if (movesToCurrTile.length > 0) {
					for (var j = 0; j < movesToCurrTile.length; j++) {
						let moveToCurrTile = movesToCurrTile[j];
						let futGame = new Chess(gameInfo.fen());
						futGame.move(moveToCurrTile.from + '-' + moveToCurrTile.to, {sloppy: true});
						let opponentBestAttackingMoveScore = AttackingMoveGenerator.getBestAttackingMove(futGame, moveToCurrTile.to).score;
						if (opponentBestAttackingMoveScore <= -1) {
							return moveToCurrTile.from + '-' + moveToCurrTile.to;
						}
					}
				}
			}
			return null;
	}

}