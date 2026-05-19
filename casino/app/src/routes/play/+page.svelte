<script lang="ts">
  import { enhance } from "$app/forms";
  import RouletteWheel from "./wheel.svelte";
  import RouletteBoard from "./board.svelte";
  import ChipSelect from "./chipselect.svelte";
  import { bets as possibleBets } from "$lib/roulette";
  import HistoryPanel from "./historypanel.svelte";
  let { data, form }: PageProps = $props();

  let activeChip = $state(10);
  let bets = $state({});
  let totalBet = $derived(Object.values(bets).reduce((a, b) => a + b, 0));
  let lastWin = $state(0);
  let spinning = $state(false);
  let history = $state([0]);
  let spinAllowed = $derived(totalBet > 0 && !spinning && data.balance >= totalBet);
  let lastBet = 0;

  let board;
  let wheel;
</script>

<!-- Main Content Canvas -->
<main class="pt-24 px-8 pb-12 min-h-screen relative overflow-hidden">
  <div
    class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
  >
    <!-- Left Column: Roulette Wheel & History -->
    <div class="lg:col-span-5 space-y-8">
      <!-- Roulette Wheel Area -->
      <div
        class="relative aspect-square glass-panel rounded-full p-8 shadow-2xl flex items-center justify-center overflow-hidden border border-outline-variant/10"
      >
        <!-- Outer Decorative Ring -->
        <div
          class="absolute inset-0 border-[16px] border-surface-container-high rounded-full opacity-40"
        ></div>
        <!-- The Wheel -->
        <div
          class="relative w-full h-full rounded-full bg-surface-container-highest shadow-[0_0_60px_rgba(0,0,0,0.5)] border-4 border-outline-variant/20 flex items-center justify-center"
        >
          <RouletteWheel bind:this={wheel} />
        </div>
      </div>
      <!-- History Panel -->
      <HistoryPanel {history} />
    </div>

    <!-- Right Column: Betting Table & Controls -->
    <div class="lg:col-span-7 space-y-8">
      <!-- Betting Grid (The Table) -->
      <RouletteBoard bind:this={board} bind:bets {activeChip} />

      <!-- Betting Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <!-- Chip Selection -->
        <ChipSelect bind:activeChip />
        <!-- Action Buttons -->
        <div class="grid grid-cols-1 gap-y-4">
          <div class="flex gap-4">
            <button
              class="flex-1 py-5 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-bold rounded-2xl border border-outline-variant/20 transition-all active:scale-95 flex flex-col items-center justify-center"
              onclick={() => board.resetBets()}
              ><span class="icon-[line-md--trash] mb-1 text-2xl"></span>
              <span class="text-xs uppercase tracking-tighter">Clear Bets</span>
            </button>
            <form
              class="flex-2"
              method="POST"
              action="?/spin"
              use:enhance={() => {
                return async ({ result, update }) => {
                  console.log(result);
                  spinning = true;
                  if (result.type === "success") {
                    console.log("spinning to " + result.data.resultNumber);
                    wheel.spin(result.data.resultNumber);
                    setTimeout(() => {
                      history.unshift(result.data.resultNumber);
                      lastWin = result.data.totalWinnings - totalBet;
                      board.resetBets();
                      spinning = false;
                      update({ reset: false });
                    }, 10000);
                  } else {
                    update({ reset: false });
                    spinning = false;
                  }
                };
              }}
            >
              {#each Object.keys(possibleBets) as bet}
                <input
                  type="hidden"
                  id={bet}
                  name={bet}
                  bind:value={bets[bet]}
                />
              {/each}
              <button
                class="w-full h-full py-5 {spinAllowed
                  ? 'bg-gradient-to-br from-secondary to-on-secondary-fixed-variant text-on-secondary  shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:shadow-[0_0_30px_rgba(78,222,163,0.5)] active:scale-95'
                  : 'bg-gray-600'}  font-black text-xl rounded-2xl"
                disabled={!spinAllowed}
              >
                <span class="flex items-center justify-center gap-2">
                  SPIN
                  {#if !spinning}
                    <span class="icon-[mdi--play-outline] text-4xl"></span>
                  {:else}
                    <span class="spinner icon-[tdesign--load]"></span>
                  {/if}
                </span>
              </button>
            </form>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div
              class="bg-surface-container/40 p-4 rounded-2xl border border-outline-variant/10 backdrop-blur-sm"
            >
              <p
                class="text-[10px] uppercase font-black text-on-surface-variant mb-1"
              >
                Total Bet
              </p>
              <p class="text-xl font-headline font-black text-primary">
                ${totalBet}
              </p>
            </div>
            <div
              class="bg-surface-container/40 p-4 rounded-2xl border border-outline-variant/10 backdrop-blur-sm"
            >
              <p
                class="text-[10px] uppercase font-black text-on-surface-variant mb-1"
              >
                Last Win
              </p>
              <p
                class="text-xl font-headline font-black {lastWin >= 0
                  ? 'text-secondary'
                  : 'text-red-600'}"
              >
                ${lastWin}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {#if form?.error}<p class="text-red-600 font-bold">{form.error}</p>{/if}
    </div>
  </div>
</main>

<style>
  .glass-panel {
    background: rgba(23, 31, 51, 0.6);
    backdrop-filter: blur(20px);
  }
  .spinner {
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
