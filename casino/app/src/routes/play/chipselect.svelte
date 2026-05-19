<script lang="ts">
  //  let activeChip = $state(50);

  let { activeChip = $bindable(50) } = $props();

  let chips = [
    { borderColor: "border-white/20", bgColor: "bg-blue-600", value: 10 },
    { borderColor: "border-white/20", bgColor: "bg-green-600", value: 50 },
    {
      borderColor: "border-primary",
      bgColor: "bg-primary-container",
      value: 100,
    },
    { borderColor: "border-white/20", bgColor: "bg-purple-600", value: 500 },
    { borderColor: "border-white/20", bgColor: "bg-red-600", value: 1000 },
  ];
</script>

{#snippet button(borderColor: string, bgColor: string, value: number)}
  <button
    class="w-12 h-12 {activeChip == value
      ? 'text-primary scale-110 active:scale-95 chip-glow'
      : 'active:scale-90'} rounded-full border-4 border-dashed {borderColor} {bgColor} flex items-center justify-center font-black text-xs shadow-lg transition-transform"
    onclick={() => (activeChip = value)}>{value}</button
  >
{/snippet}

<div>
  <span
    class="text-xs uppercase tracking-widest font-bold text-on-surface-variant px-1"
    >Select Chip Amount</span
  >
  <div
    class="flex justify-between items-center bg-surface-container p-4 rounded-2xl border border-outline-variant/10"
  >
    {#each chips as chip}
      {@render button(chip.borderColor, chip.bgColor, chip.value)}
    {/each}
  </div>
</div>

<style>
  .chip-glow {
    filter: drop-shadow(0 0 8px currentColor);
  }
</style>
