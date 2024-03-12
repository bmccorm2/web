<script lang="ts">
   import { onMount } from "svelte";

   const GRID_SIZE = 20;
   let TICK_DELAY = 200;
   let lost = false;
   let SNAKE_HEAD = 0;
   let snakePosition = [[12, 8]];
   let direction = [0, -1];
   let highScore = 1;
   let grid = [...Array(GRID_SIZE)].map(() =>
      [...Array(GRID_SIZE)].map(() => "empty"),
   );

   const getRandomInt = (max: number) => {
      return Math.floor(Math.random() * Math.floor(max));
   };

   const generateRandomFood = () => {
      grid[getRandomInt(GRID_SIZE)][getRandomInt(GRID_SIZE)] = "food";
      grid[getRandomInt(GRID_SIZE)][getRandomInt(GRID_SIZE)] = "food";
   };

   generateRandomFood();

   $: {
      for (let i = 0; i < grid.length; i++) {
         for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "snake") {
               grid[i][j] = "empty";
            }
         }
      }

      snakePosition.forEach(([x, y]) => {
         grid[x][y] = "snake";
      });

      if (snakePosition.length > highScore) highScore = snakePosition.length;
   }

   const restart = () => {
      grid = [...Array(GRID_SIZE)].map(() =>
         [...Array(GRID_SIZE)].map(() => "empty"),
      );

      snakePosition = [[12, 8]];
      lost = false;
      generateRandomFood();
      playGame(TICK_DELAY);
   };

   const playGame = (ticks: number) => {
      setTimeout(() => {
         const [dy, dx] = direction;
         const [y, x] = snakePosition[SNAKE_HEAD];
         const newHead = [dy + y, dx + x];

         // Go out of bounds
         if (
            newHead[0] < 0 ||
            newHead[1] < 0 ||
            newHead[0] > GRID_SIZE - 1 ||
            newHead[1] > GRID_SIZE - 1
         ) {
            lost = true;
         }

         //Snake eats itself
         if (
            snakePosition.some(
               (element) =>
                  newHead[0] === element[0] && newHead[1] === element[1],
            )
         ) {
            lost = true;
         }

         if (!lost) {
            let eatFood = false;
            if (grid[newHead[0]][newHead[1]] === "food") {
               eatFood = true;
               generateRandomFood();
            }

            const snakeBody = snakePosition.slice(
               0,
               snakePosition.length - (eatFood ? 0 : 1),
            );
            snakePosition = [newHead, ...snakeBody];
            playGame(TICK_DELAY - Math.min(snakePosition.length, 15) * 10);
         }
      }, ticks);
   };

   onMount(() => {
      playGame(TICK_DELAY);
   });
</script>

<svelte:window
   on:keydown={(e) => {
      switch (e.key) {
         case "ArrowLeft":
            direction = [0, -1];
            break;
         case "ArrowRight":
            direction = [0, 1];
            break;
         case "ArrowUp":
            direction = [-1, 0];
            break;
         case "ArrowDown":
            direction = [1, 0];
            break;
         case "Enter":
            direction = [0, -1];
            restart();
            break;
         default:
            break;
      }
   }}
/>

<svelte:head>
   <title>Snake</title>
   <meta name="description" content="retro snake game" />
</svelte:head>

<div class="mt-2 flex justify-center">
   <div>
      <div class="mb-4 flex justify-between">
         <h3 class="text-2xl">
            Snake Length: {snakePosition.length}
         </h3>

         <h3 class="text-2xl">High Score: {highScore}</h3>
      </div>

      {#each grid as row}
         <div class="flex">
            {#each row as cell}
               <div class={`h-8 w-8 border border-gray-500 ${cell}`} />
            {/each}
         </div>
      {/each}

      {#if lost}
         <h3 class="mt-2 text-center text-2xl font-bold text-red-500">
            You lost! Hit enter to play again.
         </h3>
      {/if}
   </div>
</div>

<style>
   .snake {
      background-color: blue;
   }

   .food {
      background-color: red;
   }
</style>
