<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();
</script>

<main class="md:pl-64 pt-20 min-h-screen">
  <div class="max-w-7xl mx-auto px-8 py-12">
    <div class="mb-12">
      <h1
        class="text-3xl font-black font-headline text-on-surface flex items-center gap-4"
      >
        Profile
      </h1>
    </div>

    {#if data.user}
      <h1>Hi, {data.user.name}!</h1>
      <p>Your user ID is {data.user.id}.</p>
      <p>Your balance is {data.balance}.</p>
      <form method="post" action="?/signOut" use:enhance>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >Sign out</button
        >
      </form>

    {:else}
      <h1>You are not logged in.</h1>
    {/if}
  </div>
</main>
