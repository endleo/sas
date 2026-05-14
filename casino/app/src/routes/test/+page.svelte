<script lang="js">
  import { onMount } from 'svelte';
  import './style.css';
  import * as Roulette from './roulette.js';

  let container;

  onMount(() => {
    container = document.getElementById("container");
    Roulette.setContainerRef(container);
    Roulette.initializeGame();
  });
</script>

<main class="md:pl-48 md:pr-48 pt-20 pb-20 min-h-screen">
  <div id="container" class="w-full h-full"></div>
</main>
