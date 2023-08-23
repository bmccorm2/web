<script>
  import { enhance } from "$app/forms";

  export let genres;
</script>

<table class="mb-2 mx-4 table-auto w-full">
  <tbody>
    {#each genres as { description, id }}
      <tr>
        <td class="text-start">{description}</td>
        <td class="w-24">
          <form action="?/deleteGenre" method="post" use:enhance>
            <input type="hidden" name="id" value={id} />
            <button>
              <iconify-icon icon="ph:trash-bold" style="color: crimson;" />
            </button>
          </form>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
