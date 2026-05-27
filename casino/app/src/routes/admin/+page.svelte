<script lang="ts">
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();
</script>

<main class="md:pl-64 pt-20 min-h-screen">
  <div class="max-w-7xl mx-auto px-8 py-12">
    <div class="mb-12">
      <h1
        class="text-3xl font-black font-headline text-on-surface flex items-center gap-4"
      >
        Secret Admin Section
      </h1>
    </div>

    <h1>Hi, Admin!</h1>
    <p>The LCG is currently configured with the following parameters:</p>
    <ul>
      <li>Multiplier: {data.multiplier}</li>
      <li>Increment: {data.increment}</li>
      <li>Modulus: {data.modulus}</li>
    </ul>
  </div>
</main>
