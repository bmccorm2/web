<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
  } from "flowbite-svelte";
  import "iconify-icon";

  $: activeUrl = $page.url.pathname;

  const routes = [
    {
      location: "/",
      description: "Home",
    },
    {
      location: "/consumption/1",
      description: "Consumption",
    },
    {
      location: "/books",
      description: "Books",
    },
    {
      location: "/yields",
      description: "Yields",
    },
    {
      location: "/cars/3",
      description: "Cars",
    },
    {
      location: "/snake",
      description: "Snake",
    },
    {
      location: "/life",
      description: "Life",
    },
  ];

  const activeClass = "md:border-b-4 border-white";
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <iconify-icon icon="vscode-icons:file-type-svelte" width="36" />
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {activeUrl} {hidden} {activeClass}>
    {#each routes as { location, description }}
      <NavLi href={location}>{description}</NavLi>
    {/each}
  </NavUl>
</Navbar>
