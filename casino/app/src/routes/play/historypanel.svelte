<script lang="ts">
  let { history = [] } = $props();
  let numRed = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
</script>

<div class="glass-panel rounded-2xl p-6 border border-outline-variant/10">
  <div class="flex justify-between items-center mb-4">
    <h3 class="font-headline font-bold text-lg text-on-surface">
      Game History
    </h3>
    <div class="flex gap-2">
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-red-500"></span>
        <span class="text-xs font-bold text-on-surface-variant"
          >{history.length == 0
            ? 0
            : Math.round(
                (history.filter((e) => numRed.includes(e)).length /
                  history.length) *
                  100,
              )}%</span
        >
      </div>
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-surface-dim border border-outline"
        ></span>
        <span class="text-xs font-bold text-on-surface-variant"
          >{history.length == 0
            ? 0
            : Math.round(
                (history.filter((e) => !numRed.includes(e) && e != 0).length /
                  history.length) *
                  100,
              )}%</span
        >
      </div>
    </div>
  </div>

  {#snippet item(number: number, color: string)}
    <div
      class="flex-shrink-0 w-12 h-12 rounded-xl {color === 'red'
        ? 'bg-red-600 shadow-red-900/20'
        : color === 'black'
          ? 'bg-surface-container-highest border-outline-variant/30'
          : 'bg-green-600 shadow-secondary/20'} flex flex-col items-center justify-center shadow-lg"
    >
      <span
        class="text-lg font-black font-headline {color === 'green'
          ? 'text-surface-container'
          : 'text-on-surface'}">{number}</span
      >
      <span
        class="text-[8px] uppercase font-bold {color === 'green'
          ? 'text-surface-container'
          : 'text-on-surface'} opacity-70"
      >
        {#if color === "red"}
          Red
        {:else if color === "green"}
          Green
        {:else}
          Black
        {/if}
      </span>
    </div>
  {/snippet}

  <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
    {#each history.slice(0,6) as number}
      {@render item(
        number,
        numRed.includes(number) ? "red" : number == 0 ? "green" : "black",
      )}
    {/each}
  </div>
</div>

<style>
  .glass-panel {
    background: rgba(23, 31, 51, 0.6);
    backdrop-filter: blur(20px);
  }
</style>
