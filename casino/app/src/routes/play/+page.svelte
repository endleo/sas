<script lang="ts">
  import type { PageServerData } from "./$types";
  import { enhance } from "$app/forms";

  let { data, form }: { data: PageServerData } = $props();
  console.log(data.lcg);
</script>

<main class="md:pl-64 pt-20 min-h-screen">
  <p>play roulette</p>
  <p>
    {data.lcg ? `last result: ${data.lcg.lastResult}` : "No LCG data available"}
  </p>
  <form method="POST" use:enhance>
    <button>Play</button>
  </form>
</main>
