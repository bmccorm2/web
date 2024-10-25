<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import SwimWorkout from "./SwimWorkout.svelte";
  import type { SwimWorkout as SwimWorkoutType } from "$lib/types";

  let { data } = $props();

  let filterText: string = $state();
  let filteredWorkouts = $state(data.swimWorkouts);

  const filterWorkouts = () => {
    if (filterText === "") filteredWorkouts = data.swimWorkouts;
    else {
      const matchByTags = data.swimWorkouts.filter(
        (workout: SwimWorkoutType) => {
          return (
            workout.tags?.some((e) =>
              e.tag?.toLowerCase().includes(filterText.toLowerCase()),
            ) || false
          );
        },
      );
      const matchByAuthor = data.swimWorkouts.filter(
        (workout: SwimWorkoutType) =>
          workout.author?.toLowerCase().includes(filterText.toLowerCase()),
      );

      filteredWorkouts = [...new Set([...matchByTags, ...matchByAuthor])];
    }
  };
</script>

<svelte:head>
  <title>Swimming</title>
  <meta name="swim workouts" content="save swim workouts" />
</svelte:head>

<div class="flex justify-center">
  <Button
    variant="link"
    href="/swimming/modify"
    class="me-2 mt-4 w-1/2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
    >Add a Workout</Button
  >
</div>
<hr class="my-4" />

<Input
  placeholder="Search"
  bind:value={filterText}
  class="mb-4 "
  on:keyup={filterWorkouts}
/>

<div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
  {#each filteredWorkouts as workout}
    <SwimWorkout {...workout} />
  {/each}
</div>
