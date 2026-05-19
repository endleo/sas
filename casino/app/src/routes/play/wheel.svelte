<script lang="ts">
  let numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];
  let wheelnumbersAC = [
    0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10,
    23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32,
  ];

  let wheel;
  let ballTrack;

  export function spin(winningNumber) {
    let style;
    let degree;
    for (let i = 0; i < wheelnumbersAC.length; i++) {
      if (wheelnumbersAC[i] == winningNumber) {
        degree = i * 9.73 + 362;
      }
    }
    wheel.style.cssText = "animation: wheelRotate 5s linear infinite;";
    ballTrack.style.cssText = "animation: ballRotate 1s linear infinite;";

    setTimeout(function () {
      ballTrack.style.cssText = "animation: ballRotate 2s linear infinite;";
      style = document.createElement("style");
      style.type = "text/css";
      style.innerText =
        "@keyframes ballStop {from {transform: rotate(0deg);}to{transform: rotate(-" +
        degree +
        "deg);}}";
      document.head.appendChild(style);
    }, 2000);
    setTimeout(function () {
      ballTrack.style.cssText = "animation: ballStop 3s linear;";
    }, 6000);
    setTimeout(function () {
      ballTrack.style.cssText = "transform: rotate(-" + degree + "deg);";
    }, 9000);
    setTimeout(function () {
      wheel.style.cssText = "";
      if (style) style.remove();
    }, 10000);
  }
</script>

<div bind:this={wheel} class="wheel">
  <div class="outerRim"></div>
  {#each numbers as i, index}
    <div id={"sect" + (index + 1)} class="sect">
      {#if i < 10}
        <span class="single">{i}</span>
      {:else}
        <span class="double">{i}</span>
      {/if}
      <div class="block"></div>
    </div>
  {/each}

  <div class="pocketsRim"></div>
  <div bind:this={ballTrack} class="ballTrack"><div class="ball"></div></div>
  <div class="pockets"></div>
  <div class="cone"></div>
  <div class="turret"></div>
  <div class="turretHandle">
    <div class="thendOne"></div>
    <div class="thendTwo"></div>
  </div>
</div>
