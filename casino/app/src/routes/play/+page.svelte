<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { bets as possibleBets } from "$lib/roulette";

  let { data, form }: PageProps = $props();

  const bets = $state(
    Object.keys(possibleBets).reduce((acc, elem) => ({ ...acc, [elem]: 0 }), {
      [Object.keys(possibleBets)[0]]: 0,
    }),
  );

  let totalBet = $derived(Object.values(bets).reduce((a, b) => a + b, 0));
</script>

<main class="md:pl-64 pt-20 min-h-screen">
  <p>play roulette</p>
  <form
    method="POST"
    use:enhance={() => {
      return async ({ update }) => {
        for (const bet in bets) {
          bets[bet] = 0;
        }
        update({ reset: false });
      };
    }}
  >
      <div class="grid grid-cols-6 gap-4 w-fit items-center">
        {#each Object.keys(possibleBets) as bet}
          <label for={bet}>Bet on {bet}:</label>
          <input
            class="bg-surface"
            type="number"
            id={bet}
            name={bet}
            min="0"
            max="100000"
            bind:value={bets[bet]}
          />
        {/each}
      </div>

    <p>Total bet: {totalBet}</p>
    <button
      class="lg:w-40 group relative bg-secondary hover:bg-secondary-fixed text-on-secondary rounded-[2.5rem] p-1 overflow-hidden active:scale-95"
      >Play</button
    >
  </form>

  {#if form?.result}
    <!-- this message is ephemeral; it exists because the page was rendered in
	       response to a form submission. it will vanish if the user reloads -->
    <p>Successfully spun the wheel! Result: {form.value}</p>
    <p>Bets made:</p>
    {#each Object.entries(form.bets).filter((bet) => bet[1] != 0) as bet}
      <p>{bet[0]} : {bet[1]}</p>
    {/each}
    <p>Winnings: {form.winnings}</p>
  {/if}
</main>
