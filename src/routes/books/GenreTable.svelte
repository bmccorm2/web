<script lang="ts">
   import { enhance } from "$app/forms";
   import type { Genre } from "$lib/types";
   import { Trash2 } from "lucide-svelte";

   export let genres: Genre[];
</script>

<table class="mx-4 mb-2 w-full table-auto">
   <tbody>
      {#each genres as { description, id }}
         <tr>
            <td class="text-start">{description}</td>
            <td class="w-24">
               <form action="?/deleteGenre" method="post" use:enhance>
                  <input type="hidden" name="id" value={id} />
                  <button>
                     <Trash2 color="crimson" size={16} />
                  </button>
               </form>
            </td>
         </tr>
      {/each}
   </tbody>
</table>
