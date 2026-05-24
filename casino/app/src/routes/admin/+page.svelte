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

    {#if data.user}
      <h1>Hi, {data.user.name}!</h1>
    {:else}
      <h1>You are not logged in.</h1>
    {/if}
  </div>
</main>
