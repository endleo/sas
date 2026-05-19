<script lang="ts">
  import "./style.css";
  import { bets as possibleBets } from "$lib/roulette";
  import { onMount } from "svelte";

  let { activeChip = 50, bets = $bindable() } = $props();

  //  let activeChip = $state(50);
  let chips = [
    { color: "red", value: 1 },
    { color: "blue", value: 5 },
    { color: "orange", value: 10 },
    { color: "gold", value: 100 },
  ];

  let numRed = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];

  export function resetBets() {
    bets = Object.fromEntries(
      Object.entries(possibleBets).map(([k, v], i) => [k, 0]),
    );
  }

  function largestChipColor(amount: number) {
    let current = 0;
    let currentColor = "";
    for (const chip of chips) {
      if (chip.value > current && chip.value <= amount) {
        current = chip.value;
        currentColor = chip.color;
      }
    }
    return currentColor;
  }

  onMount(() => {
    resetBets();
  });

  //  $inspect(bets);
</script>

{#snippet field(name: string, text: string, className: string)}
  <button class={className} onclick={() => (bets[name] += activeChip)}
    >{text}
    {#if bets[name] > 0}
      <div class="chip {largestChipColor(bets[name])}">
        <span class="chipSpan"
          >{new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
          }).format(bets[name])}
        </span>
      </div>
    {/if}
  </button>
{/snippet}

{#snippet numField(name: string, text: string, className: string)}
  <button class={className} onclick={() => (bets[name] += activeChip)}>
    <div class="nbn">{text}</div>
    {#if bets[name] > 0}
      <div class="chip {largestChipColor(bets[name])}">
        <span class="chipSpan">{new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
          }).format(bets[name])}</span>
      </div>
    {/if}
  </button>
{/snippet}

<div id="betting_board">
  <div class="bbtop">
    {@render field("low", "1 to 18", "bbtoptwo")}
    {@render field("high", "19 to 36", "bbtoptwo")}
  </div>
  <div class="number_board">
    {@render numField("0", "0", "number_0")}
    {#each Array(12)
      .keys()
      .map((e) => 3 + e * 3) as i}
      {@render numField(
        String(i),
        String(i),
        "number_block " + (numRed.includes(i) ? "redNum" : "blackNum"),
      )}
    {/each}
    {@render numField("column1", "COL 1", "tt1_block")}
    {#each Array(12)
      .keys()
      .map((e) => 2 + e * 3) as i}
      {@render numField(
        String(i),
        String(i),
        "number_block " + (numRed.includes(i) ? "redNum" : "blackNum"),
      )}
    {/each}
    {@render numField("column2", "COL 2", "tt1_block")}
    {#each Array(12)
      .keys()
      .map((e) => 1 + e * 3) as i}
      {@render numField(
        String(i),
        String(i),
        "number_block " + (numRed.includes(i) ? "redNum" : "blackNum"),
      )}
    {/each}
    {@render numField("column3", "COL 3", "tt1_block")}
  </div>
  <div class="bo3_board">
    {@render field("dozen1", "1 to 12", "bo3_block")}
    {@render field("dozen2", "13 to 24", "bo3_block")}
    {@render field("dozen3", "25 to 36", "bo3_block")}
  </div>
  <div class="oto_board">
    {@render field("even", "EVEN", "oto_block")}
    {@render field("red", "RED", "oto_block redNum")}
    {@render field("black", "BLACK", "oto_block blackNum")}
    {@render field("odd", "ODD", "oto_block")}
  </div>
  <!--div class="controls_container">
    <div class="chipDeck">
      {#each chips as chip}
        <button
          class="cdChip {chip.color} {activeChip == chip.value
            ? 'cdChipActive'
            : ''}"
          onclick={() => (activeChip = chip.value)}
        >
          <span class="cdChipSpan">{chip.value}</span>
        </button>
      {/each}
      <button class="cdChip clearBet" onclick={resetBets}
        ><span class="cdChipSpan">clear</span></button
      >
    </div>
  </div-->
</div>
