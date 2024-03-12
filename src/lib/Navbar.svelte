<script lang="ts">
   import { page } from "$app/stores";
   import { Terminal, Menu } from "lucide-svelte";

   $: url = $page.url.pathname;
   $: activeUrl = url === "/" ? "/home" : url;

   let isShowNavbar = false;

   const routes = [
      {
         location: "/",
         description: "Home",
         searchPattern: "/home",
      },
      {
         location: "/consumption/4",
         description: "Consumption",
         searchPattern: "/consumption",
      },
      {
         location: "/books",
         description: "Books",
         searchPattern: "/books",
      },
      {
         location: "/yields",
         description: "Yields",
         searchPattern: "/yields",
      },
      {
         location: "/cars/3",
         description: "Cars",
         searchPattern: "/cars",
      },
      {
         location: "/snake",
         description: "Snake",
         searchPattern: "/snake",
      },
      {
         location: "/life",
         description: "Life",
         searchPattern: "/life",
      },
   ];

   const activeClass = "border-b-4 border-white";

   function toggleNavbar() {
      isShowNavbar = !isShowNavbar;
   }
</script>

<nav class="sticky top-0 space-x-4 bg-zinc-800 px-4 py-3 lg:space-x-6">
   <ul class="flex items-center justify-between">
      <li>
         <a href="/">
            <Terminal />
         </a>
      </li>
      <div class="md:display-block hidden space-x-4 md:flex lg:space-x-6">
         {#each routes as { location, description, searchPattern }}
            {@const isActive = activeUrl.startsWith(searchPattern)}
            <li>
               <a
                  class="text-sm font-medium hover:text-blue-500 {isActive &&
                     activeClass}"
                  href={location}>{description}</a
               >
            </li>
         {/each}
      </div>
      <li class="md:hidden">
         <button on:click={toggleNavbar}>
            <Menu />
         </button>
      </li>
   </ul>
   <nav
      class="list-none text-center md:hidden {isShowNavbar
         ? 'display-block'
         : 'hidden'}"
   >
      {#each routes as { location, description, searchPattern }}
         {@const isActive = activeUrl.startsWith(searchPattern)}
         <li>
            <a
               class="text-sm font-medium hover:text-blue-500 {isActive &&
                  activeClass}"
               href={location}>{description}</a
            >
         </li>
      {/each}
   </nav>
</nav>
