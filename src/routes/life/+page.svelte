<script lang="ts">
	let GRID_SIZE = 30;
	let TICK = 500;
	let grid = new Array(GRID_SIZE)
		.fill(0)
		.map((e) => (e = new Array(GRID_SIZE)));
	let aliveCells: number[][] = [];
	let generation = 0;
	let timers: NodeJS.Timeout[] = [];
	let isRunning: Boolean = true;
	const neighbors: number[][] = [
		[-1, -1],
		[0, -1],
		[1, -1],
		[-1, 0],
		[1, 0],
		[-1, 1],
		[0, 1],
		[1, 1]
	];

	const runLife = () => {
		timers.push(
			setTimeout(() => {
				for (let i = 0; i < grid.length; i++) {
					for (let j = 0; j < grid[i].length; j++) {
						const neighbors = getNeighbors(i, j);
						const isAlive = grid[i][j] === 1;
						switch (neighbors) {
							case 2:
							case 3:
								if (!isAlive && neighbors === 3) aliveCells.push([i, j]);
								if (isAlive) aliveCells.push([i, j]);
								break;
						}
					}
				}
				clearGrid();
				aliveCells.forEach(([y, x]) => {
					grid[y][x] = 1;
				});
				aliveCells = [];
				generation++;
				runLife();
			}, TICK)
		);
	};

	const getNeighbors = (y: number, x: number) => {
		let count = 0;
		neighbors.forEach(([changeY, changeX]) => {
			const newY = y + changeY;
			const newX = x + changeX;
			if (
				newY >= 0 &&
				newY <= GRID_SIZE - 1 &&
				newX >= 0 &&
				newX <= GRID_SIZE - 1
			) {
				count += grid[newY][newX];
			}
		});

		return count;
	};

	const randomGenerator = () => {
		reset(true);
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				const rand = Math.random();

				if (Math.random() > rand) {
					grid[i][j] = 1;
				}
			}
		}

		runLife();
	};

	const toad = () => {
		reset(true);
		grid[15][15] = 1;
		grid[15][16] = 1;
		grid[15][17] = 1;
		grid[16][16] = 1;
		grid[16][17] = 1;
		grid[16][18] = 1;
		runLife();
	};

	const blinker = () => {
		reset(true);
		grid[17][16] = 1;
		grid[18][16] = 1;
		grid[19][16] = 1;
		runLife();
	};

	const pentaDecathlon = () => {
		reset(true);
		grid[14][14] = 1;
		grid[14][15] = 1;
		grid[14][16] = 1;
		grid[14][17] = 1;
		grid[14][18] = 1;
		grid[13][15] = 1;
		grid[13][16] = 1;
		grid[13][17] = 1;
		grid[12][16] = 1;
		grid[21][14] = 1;
		grid[21][15] = 1;
		grid[21][16] = 1;
		grid[21][17] = 1;
		grid[21][18] = 1;
		grid[22][15] = 1;
		grid[22][16] = 1;
		grid[22][17] = 1;
		grid[23][16] = 1;
		runLife();
	};

	const reset = (resetGrid: Boolean) => {
		if (resetGrid) {
			clearGrid();
			generation = 0;
		}

		timers.forEach((e) => {
			clearTimeout(e);
		});
	};

	const clearGrid = () => {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				grid[i][j] = 0;
			}
		}
	};
</script>

<div class="container mx-auto">
	<button
		class="btn bg-gray-500 text-sm mt-4 border mr-2"
		on:click={randomGenerator}>Random Generator!</button
	>
	<button class="btn bg-gray-500 text-sm mt-4 border mr-2" on:click={toad}
		>Toad</button
	>
	<button class="btn bg-gray-500 text-sm mt-4 border mr-2" on:click={blinker}
		>Blinker</button
	>
	<button
		class="btn bg-gray-500 text-sm mt-4 border mr-2"
		on:click={pentaDecathlon}>Penta-Decathlon</button
	>

	{#if isRunning}
		<button
			class="btn bg-gray-500 text-sm mt-4 border mr-2"
			on:click={() => {
				isRunning = !isRunning;
				reset(false);
			}}>Pause</button
		>
	{:else}
		<button
			class="btn bg-gray-500 text-sm mt-4 border mr-2"
			on:click={() => {
				isRunning = !isRunning;
				runLife();
			}}>Resume</button
		>
	{/if}

	<h2 class="gen">Generation: {generation}</h2>

	<hr />

	<div class="center">
		{#each grid as row}
			<div class="row">
				{#each row as cell}
					<div class="square" class:bg-red-700={cell === 1} />
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.row {
		display: flex;
	}

	.square {
		border: 1px solid gray;
		height: 26px;
		width: 26px;
	}

	.center {
		justify-content: center;
		display: grid;
		margin-top: 2em;
	}

	.gen {
		justify-content: center;
		display: grid;
		margin-top: 1em;
	}
</style>
