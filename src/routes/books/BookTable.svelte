<script>
  import { enhance } from "$app/forms";
  import Card from "$lib/Card.svelte";
  import { Rating } from "flowbite-svelte";

  export let books;

  const tableHeaders = [
    "Title",
    "Author",
    "Rating",
    "Pages",
    "Fiction",
    "Genre",
    "Submitted",
    "",
  ];
</script>

<Card header="Books">
  {#if books.length === 0}
    <div class="font-bold">
      No Books Found. Add a new book <a
        class="text-blue-500 underline"
        href="/books/create">here</a
      >.
    </div>
  {:else}
    <table class="table-auto w-max m-2 mx-auto">
      <thead class="bg-slate-600">
        <tr>
          {#each tableHeaders as header}
            <th class="border border-slate-500">{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each books as { id, title, author, pages, rating, isFiction, genres, createDate }}
          <tr class="bg-slate-700 text-start">
            <td class="bg-slate-700 border border-slate-600">{title}</td>
            <td class="bg-slate-700 border border-slate-600">{author}</td>
            <td class="bg-slate-700 border border-slate-600">
              <Rating id="Rating" total={5} {rating} />
            </td>
            <td class="bg-slate-700 border border-slate-600">{pages}</td>
            <td class="bg-slate-700 border border-slate-600">{isFiction}</td>
            <td class="bg-slate-700 border border-slate-600">
              <div class="flex m-1">
                {#each genres as { description }}
                  <div class="px-3 rounded-lg bg-purple-700 text-white mr-1">
                    {description}
                  </div>
                {/each}
              </div>
            </td>
            <td class="bg-slate-700 border border-slate-600">
              {#if createDate != null}
                {createDate.split("T")[0]}
              {/if}</td
            >
            <td class="bg-slate-700 border border-slate-600">
              <form action="?/deleteBook" method="post" use:enhance>
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
  {/if}
</Card>
