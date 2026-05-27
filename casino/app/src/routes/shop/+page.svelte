<script lang="ts">
  import { enhance } from "$app/forms";

  let { data, form }: PageProps = $props();
</script>

<main class="md:pl-64 pt-20 min-h-screen">
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
  >
    <div
      class="group bg-surface-container/50 hover:bg-surface-container transition-all duration-300 rounded-2xl p-4 border border-outline-variant/10 flex flex-col"
    >
      <div
        class="aspect-square relative bg-surface-container-low rounded-xl overflow-hidden mb-4"
      >
        <img
          alt="Lucky Charm Boost"
          class="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
          data-alt="Golden four-leaf clover glowing with magical neon green light floating against a dark luxury textured background"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8XTpuzrZiQt-nfEkfRsL_a74X_MAkA11lYpyEqzhY9gv1_EiNdi3GtpmpRezafqboREoNnYLt_hhjP5HlsO0dVg-d6AYH7LcJVqDuN2iS72uVeiU62keYOcnFQQdqvLpvwi8hK3SrBVQTsgzD21Zv7h3xoXxcE2gPQmM1S_4AbaYGPqhd9RPE9I0Sp4Qj3vXwfQtBcgmXEAiNXaQdoG3DMQSxSX4uXOp9S9pGP5Lw1F_Q2xRLFSnYxmAisCwnNCXlD20o2ikCULE"
        />
      </div>
      <div class="flex-1">
        <h3 class="text-on-surface font-headline font-bold text-base mb-1">
          Flag
        </h3>
        <p class="text-on-surface-variant text-xs line-clamp-2">
          Win by being rich.
        </p>
        {#if data.flag}
          <p class="font-headline font-bold text-primary line-clamp-2">
            Flag: {data.flag}
          </p>
        {/if}
      </div>
      {#if !data.flag}
        <div class="flex items-center justify-between gap-4 mt-6">
          <div class="flex items-center gap-1.5">
            <span class="font-headline font-bold text-primary"
              >$500,000,000</span
            >
          </div>
          <form
              method="POST"
              action="?/buy"
              use:enhance>
            <button
              class="bg-surface-container-highest text-on-surface font-bold px-4 py-2 rounded-lg text-xs hover:bg-primary hover:text-on-primary transition-all"
              >Buy</button
            >
          </form>
        </div>
      {/if}
    </div>
  </div>
  {#if form?.error}<p class="text-red-600 font-bold">{form.error}</p>{/if}
</main>
